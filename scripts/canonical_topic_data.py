# -*- coding: utf-8 -*-
"""
Build canonical interviewTopics and interviewVocabulary
Strictly using the user's provided 13 texts from media_1794438787402_da2e024e.md
"""
import re, json

# 1. Exact raw texts for all 13 topics
TOPIC_DATA = [
    {
        "number": 1,
        "id": "topic_01",
        "category": "speech",
        "categoryLabel": "スピーチ（4分目標）",
        "icon": "👤",
        "title": "自分について",
        "titleJa": "自分について",
        "titleMn": "Миний тухай",
        "description": "名前、年齢、出身地、専攻、趣味、言語学習、モンゴルでの活動への期待について語る自己紹介スピーチ。",
        "examinerPromptMn": "Та өөрийнхөө тухай бичээд, ярьж чаддаг болоорой.",
        "examinerPromptJa": "自分について書いて、話せるようになりましょう。",
        "targetTimeSeconds": 60,
        "sentences": [
            {
                "mn": "Сайн байна уу? Намайг Кахо гэдэг. Би 22 настай. Би Японоос ирсэн.",
                "ja": "こんにちは。私の名前はカホです。22歳です。日本から来ました。",
                "romaji": "Sain baina uu? Namaig Kaho gedeg. Bi 22 nastai. Bi Yaponoos irsen.",
                "clozeToken": "ирсэн",
                "clozeHint": "来た（奪格・過去形）",
                "explanation": "「Намайг 〜 гэдэг」は「私を〜と言います」。「Японоос ирсэн」は奪格語尾 -оос（〜から）＋過去語尾 -сан（〜した）。"
            },
            {
                "mn": "Би Сайтама мужийн Сока хотод төрсөн. Сока хот Токио хоттой их ойрхон байдаг.",
                "ja": "埼玉県の草加市で生まれました。草加市は東京ととても近いです。",
                "romaji": "Bi Saitama mujiin Soka khotod torson. Soka khot Tokio khottoi ikh oirkhon baidag.",
                "clozeToken": "ойрхон",
                "clozeHint": "近い（共同格＋形容詞）",
                "explanation": "「төрсөн」は動詞 төрөх（生まれる）の過去形。「Токио хоттой ойрхон」は共同格 -той（〜と）＋ ойрхон（近い）。"
            },
            {
                "mn": "Би их сургуульд криминологи буюу гэмт хэргийн тухай сурсан. Би гэмт хэрэг, хүүхдийн хөгжил, нийгмийн олон асуудлыг их сонирхдог.",
                "ja": "大学で犯罪学、すなわち犯罪について学びました。犯罪、子どもの発達、社会の様々な問題に強い関心を持っています。",
                "romaji": "Bi ikh surguulid kriminologi buyuu gemt khergiin tukhai sursan. Bi gemt khereg, khuukhdiin khogjil, niigmiin olon asuudlyg ikh sonirkhdog.",
                "clozeToken": "сонирхдог",
                "clozeHint": "関心がある・興味を持つ（習慣形）",
                "explanation": "「буюу」は「すなわち、または」。「хөгжил」は発達。「асуудал」は問題。「сонирхдог」は動詞 сонирхох（関心を持つ）の習慣形 -даг/-дэг/-дог/-дөг。"
            },
            {
                "mn": "Би төгөлдөр хуур тоглох дуртай. Би багаасаа л төгөлдөр хуур тоглодог байсан. Бас дуу дуулах маш их дуртай.",
                "ja": "ピアノを弾くことが好きです。幼い頃からずっとピアノを弾いていました。また歌を歌うことも大好きです。",
                "romaji": "Bi togoldor khuur toglokh durtai. Bi bagaasaa l togoldor khuur toglodog baisan. Bas duu duulakh mash ikh durtai.",
                "clozeToken": "тоглох",
                "clozeHint": "演奏する・遊ぶ（形動詞形）",
                "explanation": "「төгөлдөр хуур」はピアノ。「тоглох дуртай」は動詞辞書形-х＋дуртай（〜するのが好き）。「багаасаа л」は「幼い頃からずっと」。"
            },
            {
                "mn": "Би хоол хийх бас дуртай. Гэртээ шинэ хоол хийж үзэх дуртай.",
                "ja": "料理をすることも好きです。家で新しい料理を作ってみるのが好きです。",
                "romaji": "Bi khool khiikh bas durtai. Gertee shine khool khiij uzekh durtai.",
                "clozeToken": "үзэх",
                "clozeHint": "〜してみる（接続助詞-ж＋үзэх）",
                "explanation": "「хоол хийх」は料理を作る。「-ж үзэх」は「〜してみる」の補助動詞構文。「гэртээ」は再帰属格（自分の家で）。"
            },
            {
                "mn": "Монголд очоод монгол хоол сайн хийж сурахыг хүсэж байна. Мөн монгол найзууддаа амттай япон хоол хийж өгмөөр байна.",
                "ja": "モンゴルへ行ったらモンゴル料理を上手に作れるようになりたいです。またモンゴルの友達に美味しい日本料理を作ってあげたいです。",
                "romaji": "Mongold ochood mongol khool sain khiij surakhyg khusej baina. Mon mongol naizuuddaa amttai yapon khool khiij ogmoor baina.",
                "clozeToken": "өгмөөр",
                "clozeHint": "〜してあげたい（願望形 -маар/-мээр）",
                "explanation": "「очоод」は動詞 очих（行く）＋副動詞-аад（〜した後に）。「-ж өгөх」は「〜してあげる」。「-маар/-мээр байна」は「〜したい」。"
            },
            {
                "mn": "Би шинэ гадаад хэл сурах дуртай. Одоо би монгол хэл хичээнгүйлэн сурч байна. Монгол хэл их сонирхолтой, гэхдээ заримдаа жаахан хэцүү санагддаг.",
                "ja": "新しい外国語を学ぶのが好きです。今、モンゴル語を熱心に勉強しています。モンゴル語はとても面白いですが、時々少し難しく感じられます。",
                "romaji": "Bi shine gadaad khel surakh durtai. Odoo bi mongol khel khicheenguilen surch baina. Mongol khel ikh sonirkholtoi, gekhdee zarimdaa jaakhan khetsuu sanagddag.",
                "clozeToken": "хичээнгүйлэн",
                "clozeHint": "熱心に・一生懸命に（副詞）",
                "explanation": "「хичээнгүйлэн」は副詞「熱心に、懸命に」。「санагддаг」は「〜と思われる、感じられる」（受動・自発語尾 -гд-）。"
            },
            {
                "mn": "Монгол хэлний үг болон дүрэм япон хэлнээс их өөр байдаг. Заримдаа би сайн ойлгохгүй байдаг. Гэхдээ өдөр бүр монгол хэл сурдаг.",
                "ja": "モンゴル語の単語や文法は日本語と大きく異なります。時々よく理解できないことがあります。それでも毎日モンゴル語を勉強しています。",
                "romaji": "Mongol khelnii ug bolon durem yapon khelnees ikh oor baidag. Zarimdaa bi sain oilgokhgui baidag. Gekhdee odor bur mongol khel surdag.",
                "clozeToken": "өөр",
                "clozeHint": "異なる・違う（奪格＋өөр）",
                "explanation": "「хэлнээс өөр」は奪格-ээс＋өөр（〜と異なる）。「ойлгохгүй байдаг」は否定接尾辞-гүй＋байх（理解できないことがある）。"
            },
            {
                "mn": "Би монгол хэлээр чөлөөтэй, сайн ярьдаг болохыг хүсэж байна. Монгол хүмүүстэй монгол хэлээр олон сайхан юмны тухай ярилцмаар байна.",
                "ja": "モンゴル語で流暢に上手に話せるようになりたいです。モンゴルの人々とモンゴル語で多くの素敵なことについて語り合いたいです。",
                "romaji": "Bi mongol kheleer cholootei, sain yaridag bolokhyg khusej baina. Mongol khumuustei mongol kheleer olon saikhan yumny tukhai yariltsmaar baina.",
                "clozeToken": "чөлөөтэй",
                "clozeHint": "自由に・流暢に（副詞）",
                "explanation": "「чөлөөтэй」は「流暢に、自由に」。「ярилцмаар байна」は共同動詞 yariltsakh（語り合う、相談する）＋願望 -маар байна。"
            },
            {
                "mn": "Би ЖАЙКА-ийн сайн дурын гишүүнээр Монгол улсад очно. Би Монголд хоёр жил амьдарна.",
                "ja": "私はJICA海外協力隊員としてモンゴル国へ行きます。モンゴルに2年間暮らします。",
                "romaji": "Bi JAIKA-iin sain duryn gishuuneer Mongol ulsad ochno. Bi Mongold khoer jil amdarna.",
                "clozeToken": "гишүүнээр",
                "clozeHint": "隊員として（造格 -аар/-ээр）",
                "explanation": "「сайн дурын гишүүнээр」は造格-ээр（〜として）。「хоёр жил амьдарна」は未来・現在形 -на（暮らす予定です）。"
            },
            {
                "mn": "Би Монголд очоод, Дорнод аймгийн Чойбалсан хотод байрлах Хүүхэд, гэр бүлийн хөгжил, хамгааллын төвд ажиллана. Би тэнд ажиллахдаа хүүхдүүдтэй хамт тоглож, олон сонирхолтой юм хийхийг хүсэж байна.",
                "ja": "モンゴルへ行ったら、ドルノド県チョイバルサン市にある「子ども・家族発達保護センター」で活動します。そこで活動する際、子どもたちと一緒に遊び、たくさんの楽しいことをしたいです。",
                "romaji": "Bi Mongold ochood, Dornod aimgiin Choibalsan khotod bairlakh Khuukhed, ger buliin khogjil, khamgaallyn tovd ajillana. Bi tend ajillakhdaa khuukhduudtei khamt togloj, olon sonirkholtoi yum khiikhiig khusej baina.",
                "clozeToken": "хамгааллын",
                "clozeHint": "保護の（名詞 хамгаалал の属格）",
                "explanation": "「Хүүхэд, гэр бүлийн хөгжил, хамгааллын төв」は子ども・家庭発達保護センター。「ажиллахдаа」は動詞 очих/ажиллах＋時を表す副動詞-хдаа（〜するとき）。"
            },
            {
                "mn": "Би олон монгол хүнтэй танилцахыг хүсэж байна. Бас сайн монгол найзуудтай болохыг чин сэтгэлээсээ хүсэж байна.",
                "ja": "多くのモンゴルの方々と知り合いたいです。そして心から素晴らしいモンゴルの友人を作りたいです。",
                "romaji": "Bi olon mongol khuntei taniltsakhyg khusej baina. Bas sain mongol naizuudtai bolokhyg chin setgeleesee khusej baina.",
                "clozeToken": "сэтгэлээсээ",
                "clozeHint": "心から（奪格・再帰語尾）",
                "explanation": "「танилцах」は知り合う。「чин сэтгэлээсээ」は「心から、真心から」（чин＋сэтгэл＋-ээс＋-ээ）。"
            },
            {
                "mn": "Монголын амттай хоол, сайхан хөгжим, соёл надад маш их сонирхолтой санагддаг. Монголд амьдрах нь шинэ сорилт бөгөөд заримдаа хэцүү байж магадгүй. Гэхдээ би үргэлж хичээх болно.",
                "ja": "モンゴルの美味しい料理、美しい音楽、文化は私にとってとても興味深いです。モンゴルで暮らすことは新たな挑戦であり、時に大変なこともあるかもしれません。しかし私は常に全力を尽くします。",
                "romaji": "Mongolyn amttai khool, saikhan khogjim, soyol nadad mash ikh sonirkholtoi sanagddag. Mongold amdrakh ni shine sorilt bogood zarimdaa khetsuu baij magadgui. Gekhdee bi urgelj khicheekh bolno.",
                "clozeToken": "сорилт",
                "clozeHint": "挑戦（名詞）",
                "explanation": "「сорилт」は「挑戦、試練」。「байж магадгүй」は「〜かもしれない（推量）」。「хичээх болно」は「努力する所存です」。"
            },
            {
                "mn": "Би Монголд очих гэж байгаадаа маш их баяртай байна. Монгол хүмүүстэй уулзаж, хамтдаа сайхан ажиллахыг тэсэн ядан хүлээж байна.",
                "ja": "モンゴルへ行くことをとても楽しみにしています。モンゴルの皆さんとお会いし、一緒に楽しく活動できる日を心待ちにしています。",
                "romaji": "Bi Mongold ochikh gej baigaadaa mash ikh bayartai baina. Mongol khumuustei uulzaj, khamtdaa saikhan ajillakhyg tesen yadan khuleej baina.",
                "clozeToken": "тэсэн",
                "clozeHint": "待ち遠しく（慣用句：тэсэн ядан хүлээх）",
                "explanation": "「тэсэн ядан хүлээж байна」は「待ちきれない思いで待っている、心待ちにしている」という重要慣用表現。"
            },
            {
                "mn": "Танилцсандаа маш их баяртай байна. Баярлалаа.",
                "ja": "お会いできて本当に嬉しいです。ありがとうございました。",
                "romaji": "Taniltsandaa mash ikh bayartai baina. Bayarlalaa.",
                "clozeToken": "Танилцсандаа",
                "clozeHint": "知り合えたことに（過去形＋与位置格・再帰）",
                "explanation": "「Танилцсандаа баяртай байна」は自己紹介を締めくくる定番表現（はじめまして、お会いできて光栄です）。"
            }
        ]
    },
    {
        "number": 2,
        "id": "topic_02",
        "category": "speech",
        "categoryLabel": "スピーチ（4分目標）",
        "icon": "👨‍👩‍👦",
        "title": "家族について",
        "titleJa": "私の家族",
        "titleMn": "Манай гэр бүл",
        "description": "5人家族（祖母、父母、兄、自分）と愛猫2匹（フク、チャビ）、兄の猫（グー）、それぞれの仕事や趣味について話すスピーチ。",
        "examinerPromptMn": "Та гэр бүлийнхээ тухай бичээд, ярьж чаддаг болоорой.",
        "examinerPromptJa": "家族について書いて、話せるようになりましょう。",
        "targetTimeSeconds": 60,
        "sentences": [
            {
                "mn": "Манай гэр бүл таван хүнтэй. Эмээ, аав, ээж, ах, бид тав хамт байдаг.",
                "ja": "私の家族は5人家族です。祖母、父、母、兄、私たち5人で一緒に暮らしています。",
                "romaji": "Manai ger bul tavan khuntei. Emee, aav, eej, akh, bid tav khamt baidag.",
                "clozeToken": "хүнтэй",
                "clozeHint": "〜人家族（共同格 -тэй）",
                "explanation": "「таван хүнтэй」は「5人いる（5人家族）」。「хамт байдаг」は「一緒にいる、暮らしている」。"
            },
            {
                "mn": "Эмээ маань одоо 82 настай. Эмээ маань нас өндөр ч гэсэн одоо хүртэл маш эрүүл энх, сайн амьдарч байна.",
                "ja": "祖母は今82歳です。祖母は高齢ですが、今でもとても元気で元気に暮らしています。",
                "romaji": "Emee maan odoo 82 nastai. Emee maan nas ondor ch gesen odoo khurtel mash eruul enkh, sain amdarch baina.",
                "clozeToken": "өндөр",
                "clozeHint": "高い（高齢：нас өндөр）",
                "explanation": "「нас өндөр」は「高齢、長寿」。「ч гэсэн」は「〜であっても、〜だが」。「эрүүл энх」は「健康で無事、元気」。"
            },
            {
                "mn": "Ээж маань 55 настай. Ээж маань сувилагч байна. Ээж маань том эмнэлэгт ажилладаггүй. Харин ахмад настнуудын гэрт машинаар очиж, тэдэнд тусалж ажилладаг.",
                "ja": "母は55歳です。母は看護師をしています。母は大きな病院では働いていません。訪問看護で高齢者のご自宅に車で行き、支援する仕事をしています。",
                "romaji": "Eej maan 55 nastai. Eej maan suvilagch baina. Eej maan tom emnelegt ajilladaggui. Kharin akhmad nastnuudyn gert mashinaar ochij, tedend tusalj ajilladag.",
                "clozeToken": "сувилагч",
                "clozeHint": "看護師（名詞）",
                "explanation": "「сувилагч」は看護師。「ахмад настнууд」は高齢者。「машинаар очиж」は車で行って。「тусалж」は手伝って・支援して。"
            },
            {
                "mn": "Аав маань бас сувилгааны ажил хийдэг гэж сонссон. Аав маань их ярьдаггүй, даруухан хүн. Тэр оройдоо өөрийнхөө өрөөнд байх дуртай. Интернет тоглоом тоглож, сонирхолтой кино, үзэх дуртай.",
                "ja": "父も介護の仕事をしていると聞いています。父はあまり口数が多くなく、穏やかで控えめな人です。夜は自分の部屋にいるのが好きです。オンラインゲームをしたり、面白い映画を観るのが好きです。",
                "romaji": "Aav maan bas suvilgaany ajil khiideg gej sonsson. Aav maan ikh yaridaggui, daruukhan khun. Ter oroidoo ooriinkhoo oroond baikh durtai. Internet togloom togloj, sonirkholtoi kino, uzekh durtai.",
                "clozeToken": "даруухан",
                "clozeHint": "控えめな・物静かな（形容詞）",
                "explanation": "「сувилгааны ажил」は介護の仕事。「даруухан」は控えめで謙虚な人柄。「оройдоо」は夜になると。"
            },
            {
                "mn": "Аав, ээжийн гэрт хоёр хөөрхөн муур байдаг. Муурнуудын нэрийг Фүкү, Чаби гэдэг. Тэд маш хөөрхон.",
                "ja": "両親の家には2匹の可愛い猫がいます。猫たちの名前はフクとチャビと言います。とても可愛いです。",
                "romaji": "Aav, eejiin gert khoer khoorkhon muur baidag. Muurnuudyn neriig Fuku, Chabi gedeg. Ted mash khoorkhon.",
                "clozeToken": "муур",
                "clozeHint": "猫（名詞）",
                "explanation": "「хөөрхөн」は可愛い。「муурнуудын нэрийг」は複数語尾-нууд＋属格-ын＋対格-ийг。"
            },
            {
                "mn": "Би нэг ахтай. Ах маань одоо ганцаараа амьдардаг. Тийм учраас уулзахад жаахан хэцүү байдаг. Бид хоёр уулзалгүй хоёр жил болж байна. Гэхдээ ах маань маш сайн байгаа гэж ээжээсээ сонссон.",
                "ja": "私には兄が1人います。兄は今一人暮らしをしています。そのため会うのは少し難しいです。私たちは2年会っていません。でも兄はとても元気でやっていると母から聞きました。",
                "romaji": "Bi neg akhtai. Akh maan odoo gantsaaraa amdardag. Tiim uchraas uulzakhad jaakhan khetsuu baidag. Bid khoer uulzalgui khoer jil bolj baina. Gekhdee akh maan mash sain baigaa gej eejeesee sonsson.",
                "clozeToken": "ганцаараа",
                "clozeHint": "一人で・一人暮らしで（副詞）",
                "explanation": "「ганцаараа」は一人で。「уулзалгүй」は動詞否定副動詞 -лгүй（会わないまま）。"
            },
            {
                "mn": "Ах маань надаас дөрвөн насаар ах. Ах бас сувилгааны ажил хийдэг. Ах маань аавтай адилхан компьютер тоглоом тоглох, кино үзэх их дуртай.",
                "ja": "兄は私より4歳年上です。兄も介護の仕事をしています。兄は父と同じようにコンピュータゲームをしたり、映画を観るのが大好きです。",
                "romaji": "Akh maan nadaas dorvon nasaar akh. Akh bas suvilgaany ajil khiideg. Akh maan aavtai adilkhan kompyuter togloom togloj, kino uzekh ikh durtai.",
                "clozeToken": "адилхан",
                "clozeHint": "同じように（形容詞・副詞）",
                "explanation": "「надаас дөрвөн насаар ах」は比較表現（私より4歳年上）。「аавтай адилхан」は「父と同様に」。"
            },
            {
                "mn": "Ах маань гэртээ бас нэг мууртай. Тэр муурын нэрийг Гүү гэдэг.",
                "ja": "兄は家で猫をもう1匹飼っています。その猫の名前はグーと言います。",
                "romaji": "Akh maan gertee bas neg muurtai. Ter muuryn neriig Guu gedeg.",
                "clozeToken": "гэртээ",
                "clozeHint": "自分の家に（再帰与位置格）",
                "explanation": "「гэртээ」は名詞 гэр ＋ 再帰与位置格語尾 -тээ（自分の家に）。「мууртой/мууртай」は猫を飼っている。"
            },
            {
                "mn": "Манай гэр бүлийнхэн бүгд ажилтай, завгүй байдаг. Тиймээс бид дандаа хамтдаа цуглаж уулздаггүй. Гэхдээ бид гар утсаараар ярьж, зураг явуулж чаддаг. Би Монголд очоод гэрийнхэнтэйгээ сонин сайхнаа хуваалцана.",
                "ja": "私の家族は皆仕事があり忙しいです。そのためいつも集まって会うことはできません。でもスマートフォンで通話し、写真を送ることができます。私はモンゴルに行ったら家族に近況や楽しい出来事を共有します。",
                "romaji": "Manai ger buliinkhen bugd ajiltai, zavgui baidag. Tiimees bid dandaa khamtdaa tsuglaj uulzaddaggui. Gekhdee bid gar utsaaraar yarj, zurag yavuulj chaddag. Bi Mongold ochood geriinkhenteigee sonin saikhnaa khuvaaltsana.",
                "clozeToken": "хуваалцана",
                "clozeHint": "分かち合う・共有する（動詞）",
                "explanation": "「цуглаж」は集まって。「гар утсаар」は携帯電話で。「сонин сайхнаа хуваалцах」は近況や楽しい話を分かち合う。"
            }
        ]
    },
    {
        "number": 3,
        "id": "topic_03",
        "category": "speech",
        "categoryLabel": "スピーチ（4分目標）",
        "icon": "🏙️",
        "title": "出身地について",
        "titleJa": "私の生まれ育った街（草加市）",
        "titleMn": "Төрсөн нутгийнхаа тухай",
        "description": "埼玉県草加市の位置、名物の草加せんべい、松並木や川、音楽の街としての特色、隣接する越谷レイクタウンについて語るスピーチ。",
        "examinerPromptMn": "Та төрсөн нутгийнхаа тухай бичээд, ярьж чаддаг болоорой.",
        "examinerPromptJa": "生まれ育った街について書いて、話せるようになりましょう。",
        "targetTimeSeconds": 60,
        "sentences": [
            {
                "mn": "Би Японы Сайтама мужийн Сока хотод төрсөн. Сока хот Японы нийслэл Токио хоттой  ойрхон байдаг. Энэ хот Японы төвд байрладаг.",
                "ja": "私は日本の埼玉県の草加市で生まれました。草加市は日本の首都である東京と近いです。この街は日本の中央部に位置しています。",
                "romaji": "Bi Yapony Saitama mujiin Soka khotod torson. Soka khot Yapony niislel Tokio khottoi oirkhon baidag. Ene khot Yapony tovd bairladag.",
                "clozeToken": "байрладаг",
                "clozeHint": "位置している（動詞）",
                "explanation": "「нийслэл」は首都。「төвд байрладаг」は中心部に位置する。"
            },
            {
                "mn": "Сока хотод далай байхгүй. Бас өндөр уул байхгүй. Харин олон гэртай сайхан хот юм.",
                "ja": "草加市には海はありません。また高い山もありません。でもたくさんの家がある素晴らしい街です。",
                "romaji": "Soka khotod dalai baikhgui. Bas ondor uul baikhgui. Kharin olon gertai saikhan khot yum.",
                "clozeToken": "далай",
                "clozeHint": "海（名詞）",
                "explanation": "「далай байхгүй」は海がない。「өндөр уул байхгүй」は高い山がない。「олон гэртэй/гэртай」は家がたくさんある。"
            },
            {
                "mn": "Сока хот тийм ч том хот биш. Гэхдээ зам цэвэрхэн, идэх юм амттай, сайхан газар.",
                "ja": "草加市はそれほど大きな街ではありません。しかし道路は清潔で、食べ物は美味しく、素敵な場所です。",
                "romaji": "Soka khot tiim ch tom khot bish. Gekhdee zam tseverkhen, idekh yum amttai, saikhan gazar.",
                "clozeToken": "цэвэрхэн",
                "clozeHint": "清潔な・綺麗な（形容詞）",
                "explanation": "「тийм ч 〜 биш」は「それほど〜ではない」。「зам цэвэрхэн」は道が綺麗。「идэх юм」は食べ物。"
            },
            {
                "mn": "Сока хотод олон төрлийн дэлгүүр, амттай хоолтой ресторанууд байдаг. Энд маш олон сайхан хүмүүс амьдардаг.",
                "ja": "草加市には様々な種類の店や、美味しい料理のレストランがあります。ここにはたくさんの素敵な人々が暮らしています。",
                "romaji": "Soka khotod olon torliin delguur, amttai khooltoi restoranuud baidag. End mash olon saikhan khumuus amdardag.",
                "clozeToken": "төрлийн",
                "clozeHint": "種類の（名詞 төрөл の属格）",
                "explanation": "「олон төрлийн」は「多くの種類の」。「амттай хоолтой」は「美味しい料理のある」。"
            },
            {
                "mn": "Сока хотод сенбэй буюу Японы цагаан будааны жигнэмэг шиг юм байдаг.",
                "ja": "草加市にはせんべい、すなわち日本の米のお菓子のようなものがあります。",
                "romaji": "Soka khotod senbei buyuu Yapony tsagaan budaany jignemeg shig yum baidag.",
                "clozeToken": "жигнэмэг",
                "clozeHint": "焼き菓子・ビスケット・クッキー（名詞）",
                "explanation": "「цагаан будаа」はお米。「жигнэмэг」は焼き菓子・クッキー。「〜 шиг юм」は「〜のようなもの」。"
            },
            {
                "mn": "Сенбэй маш амттай байдаг. Би сенбэй идэх их дуртай.",
                "ja": "せんべいはとても美味しいです。私はせんべいを食べるのが大好きです。",
                "romaji": "Senbei mash amttai baidag. Bi senbei idekh ikh durtai.",
                "clozeToken": "идэх",
                "clozeHint": "食べる（動詞辞書形）",
                "explanation": "「амттай」は美味しい。「идэх их дуртай」は食べるのがとても好き。"
            },
            {
                "mn": "Сока хотод урт гол, хажууд нь үзэсгэлэнтэй олон нарс мод байдэг. Би байгальд алхах маш их дуртай.",
                "ja": "草加市には長い川があり、その傍らには美しい松の木がたくさんあります。私は自然の中を散歩するのが大好きです。",
                "romaji": "Soka khotod urt gol, khajuud ni uzesgelentei olon nars mod baideg. Bi baigald alkhakh mash ikh durtai.",
                "clozeToken": "нарс",
                "clozeHint": "松（松の木：нарс мод）",
                "explanation": "「нарс мод」は松の木（草加松原名所）。「үзэсгэлэнтэй」は美しい。「байгальд алхах」は自然の中を散歩する。"
            },
            {
                "mn": "Сока хотод дууны хичээл байдаг. Тиймээс хүмүүс Сока хотыг “Хөгжмийн хот” гэж нэрлэдэг. Би дуу дуулах дуртай.Би энэ хотод төрсөн болохоор хөгжимд дуртай болсон байх аа. Хотын дууны хичээл надад их хөгжилтэй байсан.",
                "ja": "草加市には合唱・声楽の教室があります。そのため人々は草加市を「音楽の街」と呼びます。私は歌を歌うのが好きです。この街で生まれたからこそ音楽が好きになったのかもしれません。街の歌の授業はとても楽しかったです。",
                "romaji": "Soka khotod duuny khicheel baidag. Tiimees khumuus Soka khotyg 'Khogjmiin khot' gej nerledeg. Bi duu duulakh durtai. Bi ene khotod torson bolokhoor khogjimd durtai bolson baikh aa. Khotyn duuny khicheel nadad ikh khogjiltei baisan.",
                "clozeToken": "Хөгжмийн",
                "clozeHint": "音楽の（属格）",
                "explanation": "「Хөгжмийн хот」は音楽の街。「дуулах дуртай」は歌うのが好き。「болсон байх аа」は〜になったのだろう。"
            },
            {
                "mn": "Сока хотын хажууд Кошигая хот байдаг. Кошигая хотод Японы хамгийн том худалдааны төв байдаг. Би багаасаа тэндээс юм авдаг байсан, бас найзуудтайгаа уулздаг байсан.",
                "ja": "草加市の隣には越谷市があります。越谷市には日本最大のショッピングモール（レイクタウン）があります。私は子どもの頃からそこで買い物をしたり、友達と会ったりしていました。",
                "romaji": "Soka khotyn khajuud Koshigaya khot baidag. Koshigaya khotod Yapony khamgiin tom khudaldaany tov baidag. Bi bagaasaa tendees yum avdag baisan, bas naizuudtaigaa uulzaddag baisan.",
                "clozeToken": "худалдааны",
                "clozeHint": "商業の・買い物の（属格）",
                "explanation": "「хажууд」は隣に。「худалдааны төв」はショッピングモール。「тэндээс юм авдаг байсан」はそこで買い物をしていた。"
            }
        ]
    },
    {
        "number": 4,
        "id": "topic_04",
        "category": "speech",
        "categoryLabel": "スピーチ（4分目標）",
        "icon": "🏫",
        "title": "二本松訓練所での生活",
        "titleJa": "二本松訓練所（NTC）での生活",
        "titleMn": "Нихонмацү сургалтын төвийн амьдрал",
        "description": "福島県二本松訓練所での起床、体操、モンゴル語授業（4人クラス）、自主練習、他隊員との交流など訓練生活について語るスピーチ。",
        "examinerPromptMn": "Та Нихонмацү сургалтын төвийн амьдралын тухай бичээд, ярьж чаддаг болоорой.",
        "examinerPromptJa": "二本松訓練所の生活について書いて、話せるようになりましょう。",
        "targetTimeSeconds": 60,
        "sentences": [
            {
                "mn": "Би одоо Фүкүшима мужийн Нихонмацү сургалтын төвд амьдарч байна. Гадаад улс руу явахаасаа өмнө, бид энд хэлний болон олон бэлтгэл хийж, янз бүрийн хичээл сурч байна.",
                "ja": "私は今、福島県の二本松訓練所に暮らしています。海外へ赴任する前に、私たちはここで語学をはじめ多くの事前準備を行い、様々な研修・授業を受けています。",
                "romaji": "Bi odoo Fukushima mujiin Nihonmatsu surgaltyn tovd amdarch baina. Gadaad uls ruu yavakhaasaa omno, bid end khelnii bolon olon beltgel khiij, yanz buriin khicheel surch baina.",
                "clozeToken": "бэлтгэл",
                "clozeHint": "準備・訓練（名詞）",
                "explanation": "「явахаасаа өмнө」は動名詞-х＋再帰奪格-аасаа＋өмнө（〜行く前に）。「бэлтгэл хийх」は準備をする。"
            },
            {
                "mn": "Би өглөө бүр зургаа хагаст босдог. Өглөөний дасгал хийгээд, долоон цаг дөчин минутад өглөөний цайгаа уудаг.",
                "ja": "毎朝6時半に起きます。朝の体操をして、7時40分に朝食をとります。",
                "romaji": "Bi ogloo bur zurgaa khagast bosdog. Ogloonii dasgal khiigeed, doloon tsag dochin minutad ogloonii tsaigaa uudag.",
                "clozeToken": "босдог",
                "clozeHint": "起きる（習慣形）",
                "explanation": "「зургаа хагаст」は6時半に。「өглөөний дасгал」は朝の体操・運動。「цайгаа уух」は朝食をとる。"
            },
            {
                "mn": "Бидний хичээл өглөө найман цаг дөчин таван минутад эхэлдэг. Би өдөр бүр олон цаг монгол хэл сурдаг. Би багштайгаа хамт монгол хэлээр ярьдаг.",
                "ja": "私たちの授業は朝8時45分に始まります。私は毎日何時間もモンゴル語を学びます。先生と一緒にモンゴル語で話します。",
                "romaji": "Bidnii khicheel ogloo naiman tsag dochin tavan minutad ekheldeg. Bi odor bur olon tsag mongol khel surdag. Bi bagshtaigaa khamt mongol kheleer yaridag.",
                "clozeToken": "эхэлдэг",
                "clozeHint": "始まる（習慣形）",
                "explanation": "「найман цаг дөчин таван минутад」は8時45分に。「багштайгаа хамт」は先生と一緒に。"
            },
            {
                "mn": "Монгол хэлний хичээл маш сонирхолтой байдаг. Гэхдээ заримдаа жаахан хэцүү байдаг. Би өдөр бүр шинэ үг, дүрэм цээжлэх хэрэгтэй. Хичээл дээр багштайгаа монгол хэлээр ярихыг хичээдэг.",
                "ja": "モンゴル語の授業はとても面白いです。でも時々少し難しいです。毎日新しい単語や文法を暗記する必要があります。授業中、先生とモンゴル語で話すよう努めています。",
                "romaji": "Mongol khelnii khicheel mash sonirkholtoi baidag. Gekhdee zarimdaa jaakhan khetsuu baidag. Bi odor bur shine ug, durem tseejlekh kheregtei. Khicheel deer bagshtaigaa mongol kheleer yarikhig khicheedeg.",
                "clozeToken": "цээжлэх",
                "clozeHint": "暗記する・覚える（動詞）",
                "explanation": "「үг цээжлэх хэрэгтэй」は単語を暗記する必要がある。「ярихыг хичээдэг」は話すよう努める。"
            },
            {
                "mn": "Монгол хэлний ангид дөрвөн оюутан байдаг. Бид хамтдаа монгол хэлний хичээл давтдаг.",
                "ja": "モンゴル語のクラスには4人の訓練生がいます。私たちは一緒にモンゴル語の授業の復習をします。",
                "romaji": "Mongol khelnii angid dorvon oyutan baidag. Bid khamtdaa mongol khelnii khicheel davtdag.",
                "clozeToken": "давтдаг",
                "clozeHint": "復習する・反復する（動詞）",
                "explanation": "「ангид」はクラスに。「давтдаг」は動詞 давтах（復習する、繰り返す）の習慣形。"
            },
            {
                "mn": "Өдрийн хоол хамтдаа идээд, үдээс хойш дахин хичээлдээ суудаг.",
                "ja": "昼食を一緒に食べて、午後は再び授業に出席します。",
                "romaji": "Odriin khool khamtdaa ideed, udees khoish dakhin khicheeldee suudag.",
                "clozeToken": "үдээс хойш",
                "clozeHint": "午後・昼過ぎ（連語）",
                "explanation": "「үдээс хойш」は「午後、昼以降」。「хичээлдээ суух」は「授業に出る、着席する」。"
            },
            {
                "mn": "Би Монголд очоод сайн ажиллахын тулд өдөр бүр сайн сурах хэрэгтэй. Тийм учраас өдөр бүр монгол хэлээр ярих дасгал хийдэг.",
                "ja": "モンゴルへ行ったらしっかり活動するために、毎日しっかり学ぶ必要があります。そのため毎日モンゴル語で話す練習をしています。",
                "romaji": "Bi Mongold ochood sain ajillakhyn tuld odor bur sain surakh kheregtei. Tiim uchraas odor bur mongol kheleer yarikh dasgal khiideg.",
                "clozeToken": "дасгал",
                "clozeHint": "練習・訓練（名詞）",
                "explanation": "「ажиллахын тулд」は「活動するために（目的）」。「ярих дасгал хийдэг」は会話の練習をする。"
            },
            {
                "mn": "Орой зургаан цагт бид оройн хоолоо иддэг. Би энд өөр ЖАЙКА-ийн сайн дурын гишүүнтэйгаа хамт амьдарч байна. Бид чөлөөт цагаараа хамт сууж ярилцдаг.",
                "ja": "夜6時に夕食を食べます。私はここで他のJICAボランティア隊員たちと一緒に暮らしています。私たちは自由時間に一緒に座って語り合います。",
                "romaji": "Oroi zurgaan tsagt bid oroin khooloo iddeg. Bi end oor JAIKA-iin sain duryn gishuunteigaa khamt amdarch baina. Bid choloot tsagaaraa khamt suuj yariltssadag.",
                "clozeToken": "чөлөөт",
                "clozeHint": "自由な（形容詞：чөлөөт цаг）",
                "explanation": "「чөлөөт цаг」は自由時間。「хамт сууж ярилцдаг」は一緒に座って語り合う。"
            },
            {
                "mn": "Энд өдөр бүр завгүй байдаг. Гэхдээ энд их хөгжилтэй.",
                "ja": "ここは毎日忙しいです。しかし、ここはとても楽しいです。",
                "romaji": "End odor bur zavgui baidag. Gekhdee end ikh khogjiltei.",
                "clozeToken": "хөгжилтэй",
                "clozeHint": "楽しい・賑やかな（形容詞）",
                "explanation": "「завгүй」は時間がない、忙しい。「хөгжилтэй」は楽しい、充実している。"
            }
        ]
    },
    {
        "number": 5,
        "id": "topic_05",
        "category": "speech",
        "categoryLabel": "スピーチ（4分目標）",
        "icon": "🤝",
        "title": "モンゴルでの活動について",
        "titleJa": "モンゴルでの活動内容と抱負",
        "titleMn": "Монголд очоод хийх ажлын тухай",
        "description": "ドルノド県子ども家庭センターでの活動、日本文化紹介（絵・歌・遊び）、英語指導、子どもたちとの相互学習、2年間の抱負を語るスピーチ。",
        "examinerPromptMn": "Та Монголд очоод, хийх ажлынхаа тухай бичээд, ярьж чаддаг болоорой.",
        "examinerPromptJa": "モンゴルへ行ったら行う仕事について書いて、話せるようになりましょう。",
        "targetTimeSeconds": 60,
        "sentences": [
            {
                "mn": "Би ЖАЙКА-ийн сайн дурын гишүүнээр Монгол улс руу явна. Миний ажил бол хүүхдүүдтэй хамт ажиллаж, тоглож, дуу дуулж, олон юм хийх сайн дурын ажилтан юм.",
                "ja": "私はJICA海外協力隊員としてモンゴル国へ行きます。私の仕事は、子どもたちと一緒に活動し、遊び、歌を歌い、たくさんのことを行うボランティアです。",
                "romaji": "Bi JAIKA-iin sain duryn gishuuneer Mongol uls ruu yavna. Minii ajil bol khuukhduudtei khamt ajillaj, togloj, duu duulj, olon yum khiikh sain duryn ajiltan yum.",
                "clozeToken": "ажилтан",
                "clozeHint": "活動者・職員（名詞）",
                "explanation": "「сайн дурын ажилтан」はボランティア活動員。「хүүхдүүдтэй хамт」は子どもたちと一緒に。"
            },
            {
                "mn": "Дорнод аймгийн Хүүхэд, гэр бүлийн төвд ажиллах болно. Би хүүхдүүдтэй хамт олон шинэ юм сурмаар байна.",
                "ja": "ドルノド県の子ども・家庭センターで活動する予定です。私は子どもたちと一緒に多くの新しいことを学びたいです。",
                "romaji": "Dornod aimgiin Khuukhed, ger buliin tovd ajillakh bolno. Bi khuukhduudtei khamt olon shine yum surmaar baina.",
                "clozeToken": "төвд",
                "clozeHint": "センターで（与位置格）",
                "explanation": "「Хүүхэд, гэр бүлийн төвд」は子ども・家庭センターで。「ажиллах болно」は活動することになります。"
            },
            {
                "mn": "Би тэнд хүүхдүүдтэй хамт ажиллана. Тийм учраас ажлын дараа хүүхдүүдтэй тоглоом тоглож, сайн найзууд болохыг хүсэж байна.",
                "ja": "そこで子どもたちと一緒に活動します。ですから活動の後には子どもたちとゲームや遊びをし、良い友達になりたいです。",
                "romaji": "Bi tend khuukhduudtei khamt ajillana. Tiim uchraas ajlyn daraa khuukhduudtei togloom togloj, sain naizuud bolokhyg khusej baina.",
                "clozeToken": "найзууд",
                "clozeHint": "友達（複数形）",
                "explanation": "「тоглоом тоглож」は遊び・ゲームをして。「найзууд болохыг хүсэж байна」は友達になりたい。"
            },
            {
                "mn": "Миний ажил бол хүүхдүүдэд гадаад орны тухай заах юм. Би хүүхдүүдтэй хамт Японы  зураг зурж, дуу дуулж, тоглоно. Бас би Японы тухай олон юм ярьж өгнө.",
                "ja": "私の仕事は子どもたちに外国について教えることです。子どもたちと一緒に日本の絵を描き、歌を歌い、遊びます。また日本のことについてたくさんの話をしてあげます。",
                "romaji": "Minii ajil bol khuukhduuded gadaad orny tukhai zaakh yum. Bi khuukhduudtei khamt Yapony zurag zurj, duu duulj, toglono. Bas bi Yapony tukhai olon yum yarj ogno.",
                "clozeToken": "ярьж өгнө",
                "clozeHint": "話してあげる（補助動詞）",
                "explanation": "「зураг зурах」は絵を描く。「ярьж өгөх」は話してあげる。"
            },
            {
                "mn": "Бас хүүхдүүдэд англи хэлээр дуу, энгийн үгсийг зааж өгнө.",
                "ja": "また子どもたちに英語で歌や簡単な言葉を教えてあげます。",
                "romaji": "Bas khuukhduuded angli kheleer duu, engiin ugsiig zaaj ogno.",
                "clozeToken": "энгийн",
                "clozeHint": "簡単な・基礎的な（形容詞）",
                "explanation": "「англи хэлээр」は英語で。「энгийн үгс」は簡単な言葉・基礎単語。「зааж өгөх」は教えてあげる。"
            },
            {
                "mn": "Би Монголд хоёр жил амьдарч ажиллана. Надад монголын гэр бүлийн амьдрал, монгол тоглоом, соёл, гэх мэт юм маш сонирхолтой. Би хүүхдээс янз бүрийн юмхы тухай сурмаар байна.",
                "ja": "私はモンゴルに2年間暮らして活動します。私にとってモンゴルの家庭生活、モンゴルの遊び、文化などがとても興味深いです。私は子どもたちから様々なことについて学びたいです。",
                "romaji": "Bi Mongold khoer jil amdarch ajillana. Nadad mongolyn ger buliin amdral, mongol togloom, soyol, gekh met yum mash sonirkholtoi. Bi khuukhdees yanz buriin yumkhy tukhai surmaar baina.",
                "clozeToken": "соёл",
                "clozeHint": "文化（名詞）",
                "explanation": "「гэх мэт」は〜など。「хүүхдээс」は子どもたちから（奪格）。「юмхы」は「様々なこと（語）」の口語的表現。"
            },
            {
                "mn": "Би, Монгол соёлын тухай надад буюу гадаад хүнд зааж өгвол тэр хүүхдүүд сурах ч болно гэж бодож байна.",
                "ja": "モンゴルの文化について私のような外国人に教えてあげることで、その子どもたち自身も学ぶきっかけになるのではないかと考えています。",
                "romaji": "Bi, Mongol soyolyn tukhai nadad buyuu gadaad khund zaaj ogvol ter khuukhduud surakh ch bolno gej bodoj baina.",
                "clozeToken": "зааж өгвол",
                "clozeHint": "教えたならば（条件形）",
                "explanation": "「зааж өгвол/өгвөл」は動詞条件副動詞 -бал/-бэл/-вал/-вэл（教えたならば）。「сурах ч болно」は学びにもなる。"
            },
            {
                "mn": "Монголд амьдрах нь шинэ сорилт бөгөөд заримдаа хэцүү байж магадгүй. Гэхдээ би үргэлж хичээх болно.",
                "ja": "モンゴルで暮らすことは新たな挑戦であり、時に大変なこともあるかもしれません。しかし私は常に全力を尽くします。",
                "romaji": "Mongold amdrakh ni shine sorilt bogood zarimdaa khetsuu baij magadgui. Gekhdee bi urgelj khicheekh bolno.",
                "clozeToken": "бөгөөд",
                "clozeHint": "〜であって・かつ（接続詞）",
                "explanation": "「бөгөөд」は並列を表す接続詞「〜であり、かつ」。「үргэлж хичээх болно」は常に努力し続けます。"
            },
            {
                "mn": "Би Монголд очих гэж байгаадаа маш их баяртай байна. Монгол хүмүүстэй уулзаж, хамтдаа сайхан ажиллахыг тэсэн ядан хүлээж байна.",
                "ja": "私はモンゴルに行けることをとても喜んでいます。モンゴルの人々と出会い、一緒に楽しく活動できる日を心待ちにしています。",
                "romaji": "Bi Mongold ochikh gej baigaadaa mash ikh bayartai baina. Mongol khumuustei uulzaj, khamtdaa saikhan ajillakhyg tesen yadan khuleej baina.",
                "clozeToken": "хүлээж",
                "clozeHint": "待っている（動詞）",
                "explanation": "「тэсэн ядан хүлээж байна」は「心待ちにしている」。「баяртай байна」は嬉しい、楽しみにしている。"
            }
        ]
    },
    {
        "number": 6,
        "id": "topic_06",
        "category": "speech",
        "categoryLabel": "スピーチ（4分目標）",
        "icon": "🏕️",
        "title": "休日の過ごし方",
        "titleJa": "モンゴルでの休日にしたいこと",
        "titleMn": "Монголд байхдаа амралтын өдрүүдээр хийх зүйл",
        "description": "友人とのカフェ巡り、ボーズやホーショール等の伝統料理修得、日本料理の振る舞い、大自然での乗馬、馬頭琴やホーミー体験を語るスピーチ。",
        "examinerPromptMn": "Та Монголд байхдаа, амралтын өдрүүдээр хиймээр байгаа юмныхаа тухай бичээд, ярьж чаддаг болоорой.",
        "examinerPromptJa": "モンゴル滞在中に休日にやりたいことについて書いて、話せるようになりましょう。",
        "targetTimeSeconds": 60,
        "sentences": [
            {
                "mn": "Монголд байхдаа, амралтын өдрт олон юм хиймээр байна. Би амралтын өдрөөр найз нартайгаа уулзах дуртай. Бид хамтдаа кафе орж, амттай хоол идэж, хамт зураг авмаар байна.",
                "ja": "モンゴルにいる間、休日にたくさんのことをしたいです。私は休日に友達と会うのが好きです。私たちは一緒にカフェに行き、美味しいものを食べ、一緒に写真を撮りたいです。",
                "romaji": "Mongold baikhdaa, amraltyn odort olon yum khiimeer baina. Bi amraltyn odroor naiz nartaigaa uulzakh durtai. Bid khamtdaa kafe orj, amttai khool idej, khamt zurag avmaar baina.",
                "clozeToken": "зураг авмаар",
                "clozeHint": "写真を撮りたい（願望形）",
                "explanation": "「амралтын өдөрт/өдрт」は休日に。「кафе орж」はカフェに入って。「зураг авах」は写真を撮る。"
            },
            {
                "mn": "Би монгол үндэсний хоол хийж сурмаар байна. Монголчууд махтай хоолыг их амттай хийдэг. Ялангуяа бууз, хуушуур гэх мэт янз бүрийн монгол хоол сурч, Японд харихдаа,гэр бүлийнхэндээ хииж өгмөөр байна.",
                "ja": "モンゴルの伝統料理を作れるようになりたいです。モンゴル人は肉料理をとても美味しく作ります。特にボーズやホーショールなど様々なモンゴル料理を覚えて、日本に帰国した際に家族に作ってあげたいです。",
                "romaji": "Bi mongol undesnii khool khiij surmaar baina. Mongolchuud makhtai khoolyg ikh amttai khiideg. Yalanguya buuz, khuushuur gekh met yanz buriin mongol khool surch, Yapond kharikhdaa, ger buliinkhendee khiij ogmoor baina.",
                "clozeToken": "үндэсний",
                "clozeHint": "伝統の・民族の（属格）",
                "explanation": "「үндэсний хоол」は伝統料理。「бууз, хуушуур」はボーズ（肉まん）とホーショール（揚げパイ）。「хийн/хийж өгмөөр байна」は作ってあげたい。"
            },
            {
                "mn": "Би япон хоол хийх дуртай болохоор өөрийн гараар амттай япон хоол бэлтгэж, монгол найз нарыг хоолоор дайлмаар байна.",
                "ja": "私は日本料理を作るのが好きなので、自分の手で美味しい日本食を調理し、モンゴルの友人たちにご馳走したいです。",
                "romaji": "Bi yapon khool khiikh durtai bolokhoor ooriin garaar amttai yapon khool beltgej, mongol naiz naryg khooloor dailmaar baina.",
                "clozeToken": "дайлмаар",
                "clozeHint": "ご馳走したい・振る舞いたい（動詞 дайлах）",
                "explanation": "「өөрийн гараар」は自分の手で。「хоолоор дайлах」は料理をご馳走する、もてなす。"
            },
            {
                "mn": "Бас би хөдөө очиж морь унамаар байна. Японд морь унах боломж жаахан хэцүү.",
                "ja": "また私は田舎へ行って馬に乗りたいです。日本では馬に乗る機会はなかなか難しいです。",
                "romaji": "Bas bi khodoo ochij mori unamaar baina. Yapond mori unakh bolomj jaakhan khetsuu.",
                "clozeToken": "унамаар",
                "clozeHint": "（馬などに）乗りたい（動詞 унах）",
                "explanation": "「хөдөө」は田舎・地方。「морь унах」は馬に乗る。「боломж жаахан хэцүү」は機会・可能性が少し難しい。"
            },
            {
                "mn": "Монголын онгон байгаль, үзэсгэлэнтэй гэж боддог. Тийм учраас хөдөө очж,морь унаж, олон сайхан газар үзэхийг хүсэж байна.",
                "ja": "モンゴルの手付かずの大自然は素晴らしいと思います。ですから田舎へ行き、馬に乗り、たくさんの美しい場所を見たいです。",
                "romaji": "Mongolyn ongon baigal, uzesgelentei gej boddog. Tiim uchraas khodoo ochj, mori unaj, olon saikhan gazar uzekhyg khusej baina.",
                "clozeToken": "онгон",
                "clozeHint": "手付かずの・大自然の（形容詞）",
                "explanation": "「онгон байгаль」は手付かずの大自然。「үзэсгэлэнтэй」は美しい。「олон сайхан газар үзэх」は多くの素晴らしい場所を見る。"
            },
            {
                "mn": "Би хөгжимд их хайртай. Тийм учраас монголын хөгжим, жишээлбэл, морин хуур тоглож сурмаар байна. Ялангуяа би дуу дуулах дуртай болохоор хөөмий гэдэг монгол дуу дуулж сурмаар байна. Монголд очихдоо,найз нартайгаа олон сайхан цагийг өнгөрүүлмээр байна.",
                "ja": "私は音楽が大好きです。ですからモンゴルの音楽、例えば馬頭琴の演奏を習いたいです。特に私は歌を歌うのが好きなので、ホーミーというモンゴルの歌を歌えるようになりたいです。モンゴルに行ったら、友達と多くの素敵な時間を過ごしたいです。",
                "romaji": "Bi khogjimd ikh khairtai. Tiim uchraas mongolyn khogjim, jisheelbel, morin khuur togloj surmaar baina. Yalanguya bi duu duulakh durtai bolokhoor khoomii gedeg mongol duu duulj surmaar baina. Mongold ochikhdoo, naiz nartaigaa olon saikhan tsagiig ongoroolmeer baina.",
                "clozeToken": "хөөмий",
                "clozeHint": "ホーミー（喉歌・倍音唱法）",
                "explanation": "「морин хуур」は馬頭琴。「хөөмий」はホーミー。「цагийг өнгөрүүлмээр байна」は時間を過ごしたい。"
            }
        ]
    },
    {
        "number": 7,
        "id": "topic_07",
        "category": "speech",
        "categoryLabel": "スピーチ（4分目標）",
        "icon": "🌏",
        "title": "JICAについて",
        "titleJa": "JICAとボランティア事業について",
        "titleMn": "ЖАЙКА-ийн тухай",
        "description": "JICAの概要、設立（1974年）、協力隊発足（1965年ラオス派遣・現在74カ国）、モンゴル派遣史（1992年4月〜累計約600名・現在21名）、高校教師の影響、東日本大震災での手紙のエピソードを語るスピーチ。",
        "examinerPromptMn": "Та ЖАЙКА-ийн тухай юу гэж боддог тухайгаа бичээд, ярьж чаддаг болоорой.",
        "examinerPromptJa": "JICAについてどう思うか書いて、話せるようになりましょう。",
        "targetTimeSeconds": 60,
        "sentences": [
            {
                "mn": "ЖАЙКА бол Японы олон улсын хамтын ажиллагааны байгууллага юм.",
                "ja": "JICAは日本の国際協力機構です。",
                "romaji": "JAIKA bol Yapony olon ulsyn khamtyn ajillagaany baiguullaga yum.",
                "clozeToken": "байгууллага",
                "clozeHint": "機構・組織（名詞）",
                "explanation": "「олон улсын хамтын ажиллагаа」は国際協力。「байгууллага」は機関、組織。"
            },
            {
                "mn": "ЖАЙКА нь дэлхийн олон улсанд хөгжлийн дэмжлэг үзүүлдэг. Бас жил бүр олон тооны ЖАЙКА-ийн сайн дурын гишүүн гадаад улс руу явдаг .",
                "ja": "JICAは世界中の多くの国々に開発支援を提供しています。また毎年多数のJICAボランティア隊員が海外へ赴いています。",
                "romaji": "JAIKA ni delkhiin olon ulsand khogjliin demjleg uzuuldeg. Bas jil bur olon toony JAIKA-iin sain duryn gishuun gadaad uls ruu yavdag.",
                "clozeToken": "дэмжлэг",
                "clozeHint": "支援・援助（名詞）",
                "explanation": "「хөгжлийн дэмжлэг үзүүлэх」は開発支援を提供する。「олон тооны」は多数の。"
            },
            {
                "mn": "ЖАЙКА-ийн сайн дурын гишүүн маш олон ажилтай. Жишээлбэл, япон хэлний багш, эмч, сувилагч, ногоочин гэх мэт байдаг.",
                "ja": "JICAのボランティア隊員の職種は実に多岐にわたります。例えば、日本語教師、医師、看護師、野菜栽培隊員などがあります。",
                "romaji": "JAIKA-iin sain duryn gishuun mash olon ajiltai. Jisheelbel, yapon khelnii bagsh, emch, suvilagch, nogoochin gekh met baidag.",
                "clozeToken": "ногоочин",
                "clozeHint": "野菜栽培者・農家（名詞）",
                "explanation": "「Жишээлбэл」は例えば。「ногоочин」は野菜栽培隊員・農家。「гэх мэт」は〜など。"
            },
            {
                "mn": "Тэд очсон улсын хүмүүстэй хамт ажилладаг.",
                "ja": "彼らは赴任した国の人々と一緒に活動します。",
                "romaji": "Ted ochson ulsyn khumuustei khamt ajilladag.",
                "clozeToken": "очсон",
                "clozeHint": "赴いた・行った（過去形動詞）",
                "explanation": "「очсон улс」は赴いた国（過去形動詞連体形）。「хамт ажилладаг」は共に働く。"
            },
            {
                "mn": "ЖАЙКА нь 1974 онд байгуулагдсан урт түүхтэй байгууллага.",
                "ja": "JICAは1974年に設立された長い歴史を持つ機構です。",
                "romaji": "JAIKA ni 1974 ond baiguulagdsan urt tuukhtei baiguullaga.",
                "clozeToken": "байгуулагдсан",
                "clozeHint": "設立された（受動・過去形）",
                "explanation": "「байгуулагдсан」は動詞 байгуулах（設立する）の受動態 байгуулагдах ＋過去 -сан。「урт түүхтэй」は長い歴史のある。"
            },
            {
                "mn": "Cайн дурын ажил 1965 онд эхэлсэн. 12-р сард  5 сайн дурын гишүүн Лаос руу явсан. Одоо сайн дурын гишүүн 74 улсад ажиллаж байна.",
                "ja": "ボランティア事業は1965年に始まりました。12月に5名の青年海外協力隊員がラオスへ赴きました。現在ボランティア隊員は74カ国で活動しています。",
                "romaji": "Sain duryn ajil 1965 ond ekhelsen. 12-r sard 5 sain duryn gishuun Laos ruu yavsan. Odoo sain duryn gishuun 74 ulsad ajillaj baina.",
                "clozeToken": "Лаос",
                "clozeHint": "ラオス（国名）",
                "explanation": "1965年12月、初代協力隊員5名がラオスへ派遣された史実。「74 улсад」は74カ国で。"
            },
            {
                "mn": "Монгол улсад ЖАЙКА-ийн сайн дурын гишүүд 1992 оны дөрөвдүгээр сараас эхлэн анх ирж ажилласан түүхтэй. Монгол Улсад одоо хүртэл 600 орчим ЖАЙКА-ийн сайн дурын гишүүн очсон. Одоо ч 21 сайн дурын гишүүн ажиллаж байна.",
                "ja": "モンゴル国には1992年4月からJICAボランティア隊員が初めて派遣され活動を始めた歴史があります。モンゴル国にはこれまで約600名のJICA隊員が赴任しました。現在も21名の隊員が活動しています。",
                "romaji": "Mongol ulsad JAIKA-iin sain duryn gishuud 1992 ony dorovdugeer saraas ekhlen ankh irj ajillasan tuukhtei. Mongol Ulsad odoo khurtel 600 orchim JAIKA-iin sain duryn gishuun ochson. Odoo ch 21 sain duryn gishuun ajillaj baina.",
                "clozeToken": "орчим",
                "clozeHint": "約・およそ（後置詞）",
                "explanation": "「дөрөвдүгээр сараас эхлэн」は4月から。「600 орчим」は約600名。「одоо ч」は現在も。"
            },
            {
                "mn": "Миний ахлах сургуулийн багш өмнө нь ЖАЙКА-ийн сайн дурын гишүүн байсан.Тэр надад олон сонирхолтой юмны тухай ярьж өгсөн. Би тэр яриаг сонирхоод, сайн дурын гишүүн болъё гэж бодсон.",
                "ja": "私の高校の先生はかつてJICA海外協力隊員でした。その先生が私にたくさんの興味深いお話をしてくれました。私はその話に関心を持ち、ボランティア隊員になろうと決意しました。",
                "romaji": "Minii akhlakh surguuliin bagsh omno ni JAIKA-iin sain duryn gishuun baisan. Ter nadad olon sonirkholtoi yumny tukhai yarj ogson. Bi ter yariag sonirkhood, sain duryn gishuun bolyo gej bodson.",
                "clozeToken": "болъё",
                "clozeHint": "なろう（意志形 -я/-е/-ё）",
                "explanation": "「ахлах сургууль」は高校。「болъё гэж бодсон」は「〜になろうと思った（意志形-ё＋гэж бодох）」。"
            },
            {
                "mn": "Би шинэ улсын соёл сурах дуртай. Монгол хүмүүстэй хамт амьдарч, тэднээс олон юмны тухай сонсмоор байна.",
                "ja": "私は新しい国の文化を学ぶのが好きです。モンゴルの人々と共に暮らし、彼らからたくさんのことを聞きたいです。",
                "romaji": "Bi shine ulsyn soyol surakh durtai. Mongol khumuustei khamt amdarch, tednees olon yumny tukhai sonsmoor baina.",
                "clozeToken": "сонсмоор",
                "clozeHint": "聞きたい（願望形）",
                "explanation": "「тэднээс」は彼らから（奪格）。「сонсмоор байна」は聞きたい。"
            },
            {
                "mn": "Би ЖАЙКА, ялангуяа ЖАЙКА-ийн сайн дурын гишүүн,маш сайхан гэж боддог.",
                "ja": "私はJICA、とりわけJICA海外協力隊員はとても素晴らしい活動だと考えています。",
                "romaji": "Bi JAIKA, yalanguya JAIKA-iin sain duryn gishuun, mash saikhan gej boddog.",
                "clozeToken": "ялангуяа",
                "clozeHint": "特に・とりわけ（副詞）",
                "explanation": "「ялангуяа」は特に、とりわけ。「маш сайхан гэж боддог」はとても素晴らしいと思う。"
            },
            {
                "mn": "Үүний нотолгоо нь Зүүн Японд том газар хөдлөлт болоход олон улсны хүмүүс ЖАЙКАд “Дандаа маш их баярлалаа, Хичээгээрэй” гэсэн захидал илгээсэн гэж сонссон.",
                "ja": "その証拠に、東日本大震災が起きた際、世界各国の多くの人々からJICAに『いつも本当にありがとう、頑張って』という手紙が寄せられたと聞きました。",
                "romaji": "Uunii notolgoo ni Zuun Yapond tom gazar khodlolt bolokhod olon ulsny khumuus JAIKAd 'Dandaa mash ikh bayarlalaa, Khicheegeerei' gesen zakhidal ilgeesen gej sonsson.",
                "clozeToken": "нотолгоо",
                "clozeHint": "証拠・あかし（名詞）",
                "explanation": "「Үүний нотолгоо нь」はその証拠に。「газар хөдлөлт」は地震。「захидал илгээсэн」は手紙を送った。"
            },
            {
                "mn": "Миний бодлоор ЖАЙКА нь Японы олон улсын хамтын ажиллагаанд маш чухал байгууллага юм.",
                "ja": "私の考えでは、JICAは日本の国際協力において極めて重要な機構です。",
                "romaji": "Minii bodloor JAIKA ni Yapony olon ulsyn khamtyn ajillagaand mash chukhal baiguullaga yum.",
                "clozeToken": "чухал",
                "clozeHint": "重要な・大切な（形容詞）",
                "explanation": "「Миний бодлоор」は「私の考えでは」。「чухал байгууллага」は重要な組織・機関。"
            }
        ]
    },
    {
        "number": 8,
        "id": "topic_08",
        "category": "roleplay",
        "categoryLabel": "実践ロールプレイ対話",
        "icon": "🏥",
        "title": "病院にて",
        "titleJa": "病院での診察・症状の伝達",
        "titleMn": "Эмнэлэгт",
        "description": "医師との診察対話：頭痛の症状、発熱（38度）、喉の痛み、口を開けての診察、解熱鎮痛剤の処方と食後1日3回の服用指示。",
        "examinerPromptMn": "Та эмнэлэгт очвол, эмчтэй юу гэж ярих вэ?",
        "examinerPromptJa": "病院に行ったら、医師とどのように話しますか？",
        "targetTimeSeconds": 45,
        "sentences": [
            {
                "speaker": "Эмч",
                "mn": "Сайн байна уу? Та энэ сандал дээр суугаарай.",
                "ja": "こんにちは。この椅子にお掛けください。",
                "romaji": "Sain baina uu? Ta ene sandal deer suugaarai.",
                "clozeToken": "суугаарай",
                "clozeHint": "お座りください（丁寧な命令 -аарай）",
                "explanation": "「сандал дээр」は椅子の上に。「суугаарай」は座ってください。"
            },
            {
                "speaker": "Би",
                "mn": "Сайн байна уу? Маш их баярлалаа, эмч ээ.",
                "ja": "こんにちは。どうもありがとうございます、先生。",
                "romaji": "Sain baina uu? Mash ikh bayarlalaa, emch ee.",
                "clozeToken": "эмч ээ",
                "clozeHint": "先生！（呼格 -ээ）",
                "explanation": "「эмч ээ」は医師に対する呼びかけ（呼格）。"
            },
            {
                "speaker": "Эмч",
                "mn": "За, таны бие яаж байна? Биеийн хаана чинь өвдөж байна вэ?",
                "ja": "さて、体の具合はいかがですか？ お体のどこが痛みますか？",
                "romaji": "Za, tany bie yaaj baina? Bieiin khaana chin ovdoj baina ve?",
                "clozeToken": "өвдөж",
                "clozeHint": "痛む（動詞 өвдөх）",
                "explanation": "「бие яаж байна?」は体の調子はどうですか。「хаана чинь өвдөж байна вэ?」は体のどこが痛みますか。"
            },
            {
                "speaker": "Би",
                "mn": "Миний толгой маш их өвдөж байна.",
                "ja": "頭がひどく痛みます。",
                "romaji": "Minii tolgoi mash ikh ovdoj baina.",
                "clozeToken": "толгой",
                "clozeHint": "頭（名詞）",
                "explanation": "「толгой маш их өвдөж байна」は頭がとても痛む。"
            },
            {
                "speaker": "Эмч",
                "mn": "Толгойн өвдөлт хэзээнээс эхэлсэн бэ? Өчигдөр үү, уржигдар уу?",
                "ja": "頭痛はいつから始まりましたか？ 昨日ですか、一昨日ですか？",
                "romaji": "Tolgoin ovdolt khezeenees ekhelsen be? Ochigdor uu, urjigdar uu?",
                "clozeToken": "уржигдар",
                "clozeHint": "一昨日（副詞・名詞）",
                "explanation": "「Толгойн өвдөлт」は頭痛。「уржигдар」は一昨日。「хэзээнээс」はいつから。"
            },
            {
                "speaker": "Би",
                "mn": "Өчигдөр оройноос эхэлж өвдсөн. Шөнө унтаж чадсангүй.",
                "ja": "昨日の晩から痛み始めました。夜は眠れませんでした。",
                "romaji": "Ochigdor oroinoos ekhelj ovdson. Shono untaj chadsangui.",
                "clozeToken": "унтаж чадсангүй",
                "clozeHint": "眠れませんでした（可能動詞否定）",
                "explanation": "「оройноос」は晩から。「унтаж чадсангүй」は眠ることができなかった。"
            },
            {
                "speaker": "Эмч",
                "mn": "Халуурч байна уу? Гэртээ халуунаа үзэж ирсэн уу?",
                "ja": "熱はありますか？ 家で熱を測って来ましたか？",
                "romaji": "Khaluurch baina uu? Gertee khaluunaa uzej irsen uu?",
                "clozeToken": "Халуурч",
                "clozeHint": "熱が出る・発熱する（動詞）",
                "explanation": "「халуурах」は熱を出す。「халуунаа үзэх」は体温を測る。"
            },
            {
                "speaker": "Би",
                "mn": "Тийм ээ, өглөө халуунаа үзэхэд, 38 градус  байсан.",
                "ja": "はい、今朝熱を測ったら38度ありました。",
                "romaji": "Tiim ee, ogloo khaluunaa uzekhed, 38 gradus baisan.",
                "clozeToken": "градус",
                "clozeHint": "度（単位）",
                "explanation": "「үзэхэд」は測ったときに。「38 градус」は38度。"
            },
            {
                "speaker": "Эмч",
                "mn": "Хоолой чинь ч бас өвдөж байна уу?",
                "ja": "喉も痛みますか？",
                "romaji": "Khooloi chin ch bas ovdoj baina uu?",
                "clozeToken": "Хоолой",
                "clozeHint": "喉（名詞）",
                "explanation": "「Хоолой」は喉。「ч бас」は〜もまた。"
            },
            {
                "speaker": "Би",
                "mn": "Тийм ч өвдөхгүй байна. Гэхдээ юм уухад, хоолой жаахан өвдөж байна.",
                "ja": "それほど痛くはありません。でも物を飲む時に喉が少し痛みます。",
                "romaji": "Tiim ch ovdokhgui baina. Gekhdee yum uukhad, khooloi jaakhan ovdoj baina.",
                "clozeToken": "уухад",
                "clozeHint": "飲む時に（動詞 уух の副動詞）",
                "explanation": "「юм уухад」は何かを飲むときに。「жаахан өвдөж байна」は少し痛みます。"
            },
            {
                "speaker": "Эмч",
                "mn": "Ойлголоо. За, амаа том нээгээрэй. Хоолой чинь жаахан улаан гэж бодож байна.",
                "ja": "分かりました。はい、お口を大きく開けてください。喉が少し赤くなっているようですね。",
                "romaji": "Oilgoloo. Za, amaa tom neegeerei. Khooloi chin jaakhan ulaan gej bodoj baina.",
                "clozeToken": "нээгээрэй",
                "clozeHint": "開けてください（動詞 нээх）",
                "explanation": "「амаа том нээгээрэй」は口を大きく開けてください。「улаан」は赤い。"
            },
            {
                "speaker": "Би",
                "mn": "Би ямар нэгэн эм ууж болох уу? Би хурдан эдгэрэхийг хүсэж байна.",
                "ja": "何か薬を飲んでもいいですか？ 早く治りたいです。",
                "romaji": "Bi yamar negen em uuj bolokh uu? Bi khurdan edgerekhiig khusej baina.",
                "clozeToken": "эдгэрэхийг",
                "clozeHint": "治る・快復する（動詞）",
                "explanation": "「ямар нэгэн эм」は何かの薬。「эдгэрэх」は病気が治る、快復する。"
            },
            {
                "speaker": "Эмч",
                "mn": "Тийм ээ. Би танд толгойн өвчин намдаах эм өгье.",
                "ja": "はい。あなたに鎮痛剤（頭痛を和らげる薬）を出しましょう。",
                "romaji": "Tiim ee. Bi tand tolgoin ovchin namdaakh em ogye.",
                "clozeToken": "намдаах",
                "clozeHint": "和らげる・鎮める（動詞）",
                "explanation": "「өвчин намдаах эм」は痛み止め、鎮痛剤。「өгье」はあげましょう。"
            },
            {
                "speaker": "Би",
                "mn": "Их баярлалаа. Энэ эмийг өдөрт хэдэн удаа, яаж уух ёстой вэ?",
                "ja": "どうもありがとうございます。この薬は1日何回、どのように飲むべきですか？",
                "romaji": "Ikh bayarlalaa. Ene emiig odort kheden udaa, yaaj uukh yostoi ve?",
                "clozeToken": "ёстой",
                "clozeHint": "〜すべき・義務（助動詞）",
                "explanation": "「өдөрт хэдэн удаа」は1日に何回。「яаж уух ёстой вэ?」はどのように飲むべきですか。"
            },
            {
                "speaker": "Эмч",
                "mn": "Энэ эмийг хоолны дараа өдөрт гурван удаа усаар уугаарай. Сайн амраарай.",
                "ja": "この薬を食後に1日3回、お水で飲んでください。お大事に、しっかり休んでくださいね。",
                "romaji": "Ene emiig khoolny daraa odort gurvan udaa usaar uugaarai. Sain amraarai.",
                "clozeToken": "амраарай",
                "clozeHint": "休んでください・お大事に（挨拶）",
                "explanation": "「хоолны дараа」は食後に。「усаар уугаарай」は水でお飲みください。「Сайн амраарай」はお大事に。"
            }
        ]
    },
    {
        "number": 9,
        "id": "topic_09",
        "category": "roleplay",
        "categoryLabel": "実践ロールプレイ対話",
        "icon": "🛒",
        "title": "店・スーパーにて",
        "titleJa": "食料品店での買い物対話",
        "titleMn": "Дэлгүүрт",
        "description": "店員と客の対話：牛乳（3,000トゥグルグ）、卵（4,500トゥグルグ）、ミニトマト（700トゥグルグ）、合計8,200トゥグルグの計算とカード決済。",
        "examinerPromptMn": "Та дэлгүүрт ороод, худалдагчтай юу гэж ярих вэ?",
        "examinerPromptJa": "店に入ったら、店員とどのように話しますか？",
        "targetTimeSeconds": 45,
        "sentences": [
            {
                "speaker": "Худалдагч",
                "mn": "Сайн байна уу? Та юу авах вэ?",
                "ja": "いらっしゃいませ。何をお求めですか？",
                "romaji": "Sain baina uu? Ta yuu avakh ve?",
                "clozeToken": "авах",
                "clozeHint": "買う・取る（動詞）",
                "explanation": "「юу авах вэ?」は何を買いますか。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Сайн байна уу? Сүү байна уу?",
                "ja": "こんにちは。牛乳はありますか？",
                "romaji": "Sain baina uu? Suu baina uu?",
                "clozeToken": "Сүү",
                "clozeHint": "牛乳（名詞）",
                "explanation": "「Сүү」は牛乳。「байна уу?」はありますか。"
            },
            {
                "speaker": "Худалдагч",
                "mn": "Тийм ээ, байна. Нэг сүү 3,000 төгрөг.",
                "ja": "はい、あります。牛乳1パック3,000トゥグルグです。",
                "romaji": "Tiim ee, baina. Neg suu 3,000 togrog.",
                "clozeToken": "төгрөг",
                "clozeHint": "トゥグルグ（通貨単位）",
                "explanation": "「төгрөг」はモンゴルの通貨単位。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, нэг сүү авъя. Бас өндөг байна уу?",
                "ja": "では牛乳を1つください。それと卵はありますか？",
                "romaji": "Za, neg suu avya. Bas ondog baina uu?",
                "clozeToken": "өндөг",
                "clozeHint": "卵（名詞）",
                "explanation": "「авъя」は買います、ください。「өндөг」は卵。"
            },
            {
                "speaker": "Худалдагч",
                "mn": "Тийм ээ, байна. Өндөг авах уу?",
                "ja": "はい、あります。卵を買われますか？",
                "romaji": "Tiim ee, baina. Ondog avakh uu?",
                "clozeToken": "авах уу",
                "clozeHint": "買いますか（疑問）",
                "explanation": "「Өндөг авах уу?」は卵を買いますか。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Тийм ээ, авъя. Өндөг хэдэн төгрөг вэ?",
                "ja": "はい、買います。卵はおいくらですか？",
                "romaji": "Tiim ee, avya. Ondog kheden togrog ve?",
                "clozeToken": "хэдэн",
                "clozeHint": "いくら・いくつの（疑問詞）",
                "explanation": "「хэдэн төгрөг вэ?」はいくらですか。"
            },
            {
                "speaker": "Худалдагч",
                "mn": "Өндөг 4,500 төгрөг.",
                "ja": "卵は4,500トゥグルグです。",
                "romaji": "Ondog 4,500 togrog.",
                "clozeToken": "4,500",
                "clozeHint": "4,500（数詞）",
                "explanation": "「дөрвөн мянга таван зуун төгрөг」。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, нэг өндөг авъя. Бас ногоо байна уу?",
                "ja": "では卵を1パックください。それと野菜はありますか？",
                "romaji": "Za, neg ondog avya. Bas nogoo baina uu?",
                "clozeToken": "ногоо",
                "clozeHint": "野菜（名詞）",
                "explanation": "「ногоо」は野菜。"
            },
            {
                "speaker": "Худалдагч",
                "mn": "Тийм ээ, байна. Та ямар ногоо авах вэ?",
                "ja": "はい、あります。どんな野菜をお求めですか？",
                "romaji": "Tiim ee, baina. Ta yamar nogoo avakh ve?",
                "clozeToken": "ямар",
                "clozeHint": "どんな（疑問詞）",
                "explanation": "「ямар ногоо」はどんな野菜。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Жижиг улаан лооль байна уу?",
                "ja": "プチトマト（ミニトマト）はありますか？",
                "romaji": "Jijig ulaan looli baina uu?",
                "clozeToken": "лооль",
                "clozeHint": "トマト（名詞：улаан лооль）",
                "explanation": "「жижиг улаан лооль」はミニトマト。"
            },
            {
                "speaker": "Худалдагч",
                "mn": "Тийм ээ, байна. Нэг  700 төгрөг.",
                "ja": "はい、あります。1個700トゥグルグです。",
                "romaji": "Tiim ee, baina. Neg 700 togrog.",
                "clozeToken": "700",
                "clozeHint": "700（数詞）",
                "explanation": "「долоон зуун төгрөг」。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, нэг ширхэг  авъя.",
                "ja": "では、1つください。",
                "romaji": "Za, neg shirkheg avya.",
                "clozeToken": "ширхэг",
                "clozeHint": "個・個数助数詞（名詞）",
                "explanation": "「нэг ширхэг」は1個。"
            },
            {
                "speaker": "Худалдагч",
                "mn": "Өөр юм авах уу?",
                "ja": "他に何か買われますか？",
                "romaji": "Oor yum avakh uu?",
                "clozeToken": "Өөр",
                "clozeHint": "他の（形容詞）",
                "explanation": "「Өөр юм」は他に何か。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Үгүй, баярлалаа. Нийт хэдэн төгрөг вэ?",
                "ja": "いいえ、結構です。合計でいくらですか？",
                "romaji": "Ugui, bayarlalaa. Niit kheden togrog ve?",
                "clozeToken": "Нийт",
                "clozeHint": "合計・全部で（副詞・名詞）",
                "explanation": "「Нийт」は合計、全部で。"
            },
            {
                "speaker": "Худалдагч",
                "mn": "Нийт 8,200 төгрөг.",
                "ja": "合計で8,200トゥグルグです。",
                "romaji": "Niit 8,200 togrog.",
                "clozeToken": "8,200",
                "clozeHint": "8,200（数詞）",
                "explanation": "「найман мянга хоёр зуун төгрөг」。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Картаар төлж болох уу?",
                "ja": "カードで支払えますか？",
                "romaji": "Kartaar tolj bolokh uu?",
                "clozeToken": "Картаар",
                "clozeHint": "カードで（造格）",
                "explanation": "「төлж болох уу?」は支払えますか（許可・可能）。"
            },
            {
                "speaker": "Худалдагч",
                "mn": "Бололгүй яах вэ. Картаар төлж болно.",
                "ja": "もちろんですとも。カードでお支払いいただけます。",
                "romaji": "Bololgui yaakh ve. Kartaar tolj bolno.",
                "clozeToken": "Бололгүй яах вэ",
                "clozeHint": "もちろん・構いませんとも（慣用表現）",
                "explanation": "「Бололгүй яах вэ」は「もちろん可能ですよ」という定番の承諾表現。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, картаар төлнө.",
                "ja": "では、カードで払います。",
                "romaji": "Za, kartaar tolno.",
                "clozeToken": "төлнө",
                "clozeHint": "支払います（動詞未来形）",
                "explanation": "「төлнө」は支払います。"
            },
            {
                "speaker": "Худалдагч",
                "mn": "За, баярлалаа. Дахин ирээрэй!",
                "ja": "はい、ありがとうございました。またお越しください！",
                "romaji": "Za, bayarlalaa. Dakhin ireerei!",
                "clozeToken": "Дахин",
                "clozeHint": "再び・また（副詞）",
                "explanation": "「Дахин ирээрэй」はまた来てください（いらっしゃいませ）。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Баярлалаа. Баяртай!",
                "ja": "ありがとうございます。さようなら！",
                "romaji": "Bayarlalaa. Bayartai!",
                "clozeToken": "Баяртай",
                "clozeHint": "さようなら（挨拶）",
                "explanation": "「Баяртай」はさようなら。"
            }
        ]
    },
    {
        "number": 10,
        "id": "topic_10",
        "category": "roleplay",
        "categoryLabel": "実践ロールプレイ対話",
        "icon": "💊",
        "title": "薬局にて",
        "titleJa": "薬局での頭痛薬の購入",
        "titleMn": "Эмийн санд",
        "description": "薬剤師と客の対話：頭痛の相談、発熱の有無確認、鎮痛剤の選定、食後1日2回の服用方法、8,000トゥグルグのカード決済。",
        "examinerPromptMn": "Та эмийн санд очоод, эмийн санчтай юу гэж ярих вэ?",
        "examinerPromptJa": "薬局に行ったら、薬剤師とどのように話しますか？",
        "targetTimeSeconds": 45,
        "sentences": [
            {
                "speaker": "Эм зүйч",
                "mn": "Сайн байна уу? Танд ямар эм хэрэгтэй вэ?",
                "ja": "いらっしゃいませ。どのようなお薬が必要ですか？",
                "romaji": "Sain baina uu? Tand yamar em kheregtei ve?",
                "clozeToken": "хэрэгтэй",
                "clozeHint": "必要である（形容詞）",
                "explanation": "「хэрэгтэй」は必要である。「ямар эм」はどんな薬。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Сайн байна уу? Миний толгой өвдөж байна.",
                "ja": "こんにちは。頭が痛いのです。",
                "romaji": "Sain baina uu? Minii tolgoi ovdoj baina.",
                "clozeToken": "өвдөж байна",
                "clozeHint": "痛んでいます（進行形）",
                "explanation": "「толгой өвдөж байна」は頭が痛い。"
            },
            {
                "speaker": "Эм зүйч",
                "mn": "Хэзээнээс өвдөж байна вэ?",
                "ja": "いつから痛みますか？",
                "romaji": "Khezeenees ovdoj baina ve?",
                "clozeToken": "Хэзээнээс",
                "clozeHint": "いつから（疑問詞・奪格）",
                "explanation": "「хэзээ」＋奪格-нээс（いつから）。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Өчигдрөөс эхлээд өвдөж байна.",
                "ja": "昨日から痛み始めました。",
                "romaji": "Ochigdroos ekhleed ovdoj baina.",
                "clozeToken": "Өчигдрөөс",
                "clozeHint": "昨日から（奪格）",
                "explanation": "「Өчигдрөөс эхлээд」は昨日から始まって。"
            },
            {
                "speaker": "Эм зүйч",
                "mn": "Та халуурч байна уу?",
                "ja": "お熱はありますか？",
                "romaji": "Ta khaluurch baina uu?",
                "clozeToken": "халуурч",
                "clozeHint": "発熱する（動詞）",
                "explanation": "「халуурч байна уу?」は熱が出ていますか。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Үгүй, халуурахгүй байна. Гэхдээ толгой их өвдөж байна.",
                "ja": "いいえ、熱はありません。でも頭がとても痛みます。",
                "romaji": "Ugui, khaluurakhgui baina. Gekhdee tolgoi ikh ovdoj baina.",
                "clozeToken": "халуурахгүй",
                "clozeHint": "熱はない（動詞否定）",
                "explanation": "「халуурахгүй байна」は熱は出ていない。"
            },
            {
                "speaker": "Эм зүйч",
                "mn": "Та өөр эм уусан уу?",
                "ja": "他に何か薬を飲みましたか？",
                "romaji": "Ta oor em uusan uu?",
                "clozeToken": "уусан уу",
                "clozeHint": "飲みましたか（過去疑問）",
                "explanation": "「өөр эм」は他の薬。「уусан уу?」は飲みましたか。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Үгүй, эм уугаагүй. Ямар эм уух вэ?",
                "ja": "いいえ、薬は飲んでいません。どんな薬を飲むべきですか？",
                "romaji": "Ugui, em uugaagui. Yamar em uukh ve?",
                "clozeToken": "уугаагүй",
                "clozeHint": "飲んでいない（否定過去）",
                "explanation": "「эм уугаагүй」は薬を飲んでいない。"
            },
            {
                "speaker": "Эм зүйч",
                "mn": "Толгойн өвчин намдаах эм байна. Та үүнийг ууж болно.",
                "ja": "頭痛を和らげるお薬（鎮痛剤）があります。これを服用されると良いですよ。",
                "romaji": "Tolgoin ovchin namdaakh em baina. Ta uuniig uuj bolno.",
                "clozeToken": "намдаах эм",
                "clozeHint": "鎮痛剤（連語）",
                "explanation": "「өвчин намдаах эм」は鎮痛剤。「ууж болно」は飲んで構いません。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, баярлалаа. Энэ эмийг өдөрт хэдэн удаа уух вэ?",
                "ja": "わかりました、ありがとうございます。この薬は1日何回飲むのですか？",
                "romaji": "Za, bayarlalaa. Ene emiig odort kheden udaa uukh ve?",
                "clozeToken": "удаа",
                "clozeHint": "回（助数詞）",
                "explanation": "「хэдэн удаа」は何回。"
            },
            {
                "speaker": "Эм зүйч",
                "mn": "Өдөрт хоёр удаа ууна. Хоолны дараа уугаарай.",
                "ja": "1日2回飲みます。食後にお飲みください。",
                "romaji": "Odort khoer udaa uuna. Khoolny daraa uugaarai.",
                "clozeToken": "хоёр удаа",
                "clozeHint": "2回（回数）",
                "explanation": "「хоёр удаа」は2回。「Хоолны дараа」は食後。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, ойлголоо. Энэ эм хэдэн төгрөг вэ?",
                "ja": "はい、分かりました。このお薬はおいくらですか？",
                "romaji": "Za, oilgoloo. Ene em kheden togrog ve?",
                "clozeToken": "ойлголоо",
                "clozeHint": "分かりました（過去形）",
                "explanation": "「За, ойлголоо」ははい、承知しました。"
            },
            {
                "speaker": "Эм зүйч",
                "mn": "8,000 төгрөг.",
                "ja": "8,000トゥグルグです。",
                "romaji": "8,000 togrog.",
                "clozeToken": "8,000",
                "clozeHint": "8,000（数詞）",
                "explanation": "「найман мянган төгрөг」。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, авъя. Картаар төлж болох уу?",
                "ja": "では、買います。カードで支払えますか？",
                "romaji": "Za, avya. Kartaar tolj bolokh uu?",
                "clozeToken": "төлж",
                "clozeHint": "支払う（動詞 төлөх）",
                "explanation": "「Картаар төлж болох уу?」はカードで支払えますか。"
            },
            {
                "speaker": "Эм зүйч",
                "mn": "Тийм ээ, болно.",
                "ja": "はい、可能です。",
                "romaji": "Tiim ee, bolno.",
                "clozeToken": "болно",
                "clozeHint": "可能です（動詞）",
                "explanation": "「болно」は結構です、可能です。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, картаар төлнө. Баярлалаа.",
                "ja": "では、カードで払います。ありがとうございます。",
                "romaji": "Za, kartaar tolno. Bayarlalaa.",
                "clozeToken": "төлнө",
                "clozeHint": "支払います（動詞）",
                "explanation": "「картаар төлнө」はカードで支払います。"
            },
            {
                "speaker": "Эм зүйч",
                "mn": "Баярлалаа. Хурдан эдгээрэй!",
                "ja": "ありがとうございます。お大事に、早く良くなってくださいね！",
                "romaji": "Bayarlalaa. Khurdan edgeerei!",
                "clozeToken": "эдгээрэй",
                "clozeHint": "早く治ってください（丁寧な命令）",
                "explanation": "「Хурдан эдгээрэй」はお大事に、早く快復してください。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Баярлалаа.",
                "ja": "ありがとうございました。",
                "romaji": "Bayarlalaa.",
                "clozeToken": "Баярлалаа",
                "clozeHint": "ありがとう（挨拶）",
                "explanation": "「Баярлалаа」はありがとうございます。"
            }
        ]
    },
    {
        "number": 11,
        "id": "topic_11",
        "category": "roleplay",
        "categoryLabel": "実践ロールプレイ対話",
        "icon": "🏨",
        "title": "ホテルにて",
        "titleJa": "ホテルでの宿泊手続き（チェックイン）",
        "titleMn": "Зочид буудалд",
        "description": "ホテルのフロント係と宿泊客の対話：シングル1泊希望、料金50,000トゥグルグ、無料朝食（6:30〜8:30）、チェックイン時間（14:00）、宿泊者情報記入、カード決済、部屋番号110の案内。",
        "examinerPromptMn": "Та зочид буудалд хономоор байвал, тэндхийн ажилтантай юу гэж ярих вэ?",
        "examinerPromptJa": "ホテルに宿泊したい場合、そこの従業員とどのように話しますか？",
        "targetTimeSeconds": 45,
        "sentences": [
            {
                "speaker": "Зочид буудлын ажилтан",
                "mn": "Сайн байна уу? Танд юу хэрэгтэй вэ?",
                "ja": "いらっしゃいませ。ご用件をお伺いします。",
                "romaji": "Sain baina uu? Tand yuu kheregtei ve?",
                "clozeToken": "хэрэгтэй",
                "clozeHint": "必要ですか（形容詞）",
                "explanation": "「Танд юу хэрэгтэй вэ?」は何をお手伝いしましょうか、ご用件は。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Сайн байна уу? Би нэг хономоор байна. Нэг ортой өрөө байна уу?",
                "ja": "こんにちは。1泊したいのですが。シングルの部屋はありますか？",
                "romaji": "Sain baina uu? Bi neg khonomoor baina. Neg ortoi oroo baina uu?",
                "clozeToken": "хономоор",
                "clozeHint": "宿泊したい（動詞 хонох）",
                "explanation": "「хономоор байна」は泊まりたい。「Нэг ортой өрөө」はシングルベッドの部屋。"
            },
            {
                "speaker": "Зочид буудлын ажилтан",
                "mn": "Тийм ээ, байна. Манайд нэг ортой өрөө байгаа.",
                "ja": "はい、ございます。シングルのお部屋が空いております。",
                "romaji": "Tiim ee, baina. Manaid neg ortoi oroo baigaa.",
                "clozeToken": "байгаа",
                "clozeHint": "ある・ございます（動詞）",
                "explanation": "「Манайд」は当館に。「байгаа」はある、空いている。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, баярлалаа. Нэг хоног нь хэдэн төгрөг вэ?",
                "ja": "ありがとうございます。1泊いくらですか？",
                "romaji": "Za, bayarlalaa. Neg khonog ni kheden togrog ve?",
                "clozeToken": "хоног",
                "clozeHint": "泊・日（名詞）",
                "explanation": "「Нэг хоног нь」は1泊は。"
            },
            {
                "speaker": "Зочид буудлын ажилтан",
                "mn": "Нэг хоног нь 50,000 төгрөг.",
                "ja": "1泊50,000トゥグルグです。",
                "romaji": "Neg khonog ni 50,000 togrog.",
                "clozeToken": "50,000",
                "clozeHint": "50,000（数詞）",
                "explanation": "「тавин мянган төгрөг」。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, би нэг орой хононо. Өрөөнд өглөөний цай байгаа юу?",
                "ja": "では、1泊泊まります。部屋代に朝食は付いていますか？",
                "romaji": "Za, bi neg oroi khonono. Oroond ogloonii tsai baigaa yuu?",
                "clozeToken": "хононо",
                "clozeHint": "宿泊します（未来形）",
                "explanation": "「нэг орой хононо」は1晩泊まります。「өглөөний цай」は朝食。"
            },
            {
                "speaker": "Зочид буудлын ажилтан",
                "mn": "Тийм ээ, өглөөний цай үнэгүй.",
                "ja": "はい、朝食は無料です。",
                "romaji": "Tiim ee, ogloonii tsai unegui.",
                "clozeToken": "үнэгүй",
                "clozeHint": "無料の・ただの（形容詞）",
                "explanation": "「үнэгүй」は無料、タダ。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "Сайхан байна. Өглөөний хоол хэдэн цагт вэ?",
                "ja": "それは良いですね。朝食は何時からですか？",
                "romaji": "Saikhan baina. Ogloonii khool kheden tsagt ve?",
                "clozeToken": "цагт",
                "clozeHint": "何時に（与位置格）",
                "explanation": "「хэдэн цагт вэ?」は何時ですか。"
            },
            {
                "speaker": "Зочид буудлын ажилтан",
                "mn": "Өглөөний хоол 6:30-аас 8:30 хүртэл.",
                "ja": "朝食は6時半から8時半までです。",
                "romaji": "Ogloonii khool 6:30-aas 8:30 khurtel.",
                "clozeToken": "хүртэл",
                "clozeHint": "〜まで（後置詞）",
                "explanation": "「-аас 〜 хүртэл」は〜から〜まで。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, ойлголоо. Би хэдэн цагт өрөөндөө орж болох вэ?",
                "ja": "分かりました。何時にお部屋に入れますか（チェックインできますか）？",
                "romaji": "Za, oilgoloo. Bi kheden tsagt oroondoo orj bolokh ve?",
                "clozeToken": "өрөөндөө",
                "clozeHint": "自分の部屋に（再帰与位置格）",
                "explanation": "「өрөөндөө орж болох вэ?」は部屋に入れますか。"
            },
            {
                "speaker": "Зочид буудлын ажилтан",
                "mn": "Та 14:00 цагаас өрөөндөө орж болно.",
                "ja": "14時からお部屋にお入りいただけます。",
                "romaji": "Ta 14:00 tsagaas oroondoo orj bolno.",
                "clozeToken": "орж болно",
                "clozeHint": "入れます（許可）",
                "explanation": "「14:00 цагаас」は14時から。「орж болно」は入れます。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За. Би одоо өрөөндөө орж болох уу?",
                "ja": "分かりました。今すぐ部屋に入ることはできますか？",
                "romaji": "Za. Bi odoo oroondoo orj bolokh uu?",
                "clozeToken": "одоо",
                "clozeHint": "今（副詞）",
                "explanation": "「Би одоо өрөөндөө орж болох уу?」は今部屋に入れますか。"
            },
            {
                "speaker": "Зочид буудлын ажилтан",
                "mn": "Уучлаарай, одоо өрөө бэлэн биш байна. Та түр хүлээгээрэй.",
                "ja": "申し訳ありません、現在お部屋の準備ができておりません。少々お待ちください。",
                "romaji": "Uuchlaarai, odoo oroo belen bish baina. Ta tur khuleegeerei.",
                "clozeToken": "хүлээгээрэй",
                "clozeHint": "お待ちください（動詞 хүлээх）",
                "explanation": "「бэлэн биш байна」は準備ができていない。「түр хүлээгээрэй」は少々お待ちください。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, асуудалгүй. Би картаар төлж болох уу?",
                "ja": "はい、問題ありません。カードで支払えますか？",
                "romaji": "Za, asuudalgui. Bi kartaar tolj bolokh uu?",
                "clozeToken": "асуудалгүй",
                "clozeHint": "問題ありません・大丈夫です（形容詞）",
                "explanation": "「асуудалгүй」は問題ない、構わない。"
            },
            {
                "speaker": "Зочид буудлын ажилтан",
                "mn": "Бололгүй  яах вэ. Картаар төлж болно.Төлбөр хийхийн өмнө энэ цаасан дээр нэр, хаяг, утасны дугаараа бичээрэй.",
                "ja": "もちろんですとも。カードでお支払いいただけます。お支払いの前に、こちらの用紙にお名前、ご住所、電話番号をご記入ください。",
                "romaji": "Bololgui yaakh ve. Kartaar tolj bolno. Tolbor khiikhiin omno ene tsaasan deer ner, khayag, utasny dugaaraa bicheerei.",
                "clozeToken": "цаасан дээр",
                "clozeHint": "用紙に（名詞 цаас）",
                "explanation": "「Төлбөр хийх」はお支払いをする。「нэр, хаяг, утасны дугаараа бичээрэй」は名前、住所、電話番号を書いてください。"
            },
            {
                "speaker": "Үйлчлүүлэгч",
                "mn": "За, бичсэн. Дараа нь картаар төлнө. Баярлалаа.",
                "ja": "はい、書きました。それではカードで支払います。ありがとうございます。",
                "romaji": "Za, bichsen. Daraa ni kartaar tolno. Bayarlalaa.",
                "clozeToken": "бичсэн",
                "clozeHint": "書きました（過去形）",
                "explanation": "「бичсэн」は記入しました。「Дараа нь」はその後。"
            },
            {
                "speaker": "Зочид буудлын ажилтан",
                "mn": "Баярлалаа. Энэ таны өрөөний түлхүүр. Таны өрөө 110-р өрөө. Сайхан амраарай",
                "ja": "ありがとうございます。こちらがお部屋の鍵です。お部屋は110号室です。ごゆっくりお過ごしください。",
                "romaji": "Bayarlalaa. Ene tany oroonii tulkhuur. Tany oroo 110-r oroo. Saikhan amraarai.",
                "clozeToken": "түлхүүр",
                "clozeHint": "鍵（名詞）",
                "explanation": "「түлхүүр」は鍵。「110-р өрөө」は110号室。「Сайхан амраарай」はごゆっくりお休みください。"
            }
        ]
    },
    {
        "number": 12,
        "id": "topic_12",
        "category": "roleplay",
        "categoryLabel": "実践ロールプレイ対話",
        "icon": "🍽️",
        "title": "レストランにて",
        "titleJa": "レストランでの注文・食事・会計",
        "titleMn": "Ресторанд",
        "description": "ウェイターと客の対話：1名来店、メニューの確認、おすすめ料理（ボーズ、ホーショール）、ボーズ4個、卵サラダ、ミルクティー注文、味の感想、カード会計。",
        "examinerPromptMn": "Та ресторанд ороод, зөөгчтэй юу гэж ярих вэ?",
        "examinerPromptJa": "レストランに入ったら、給仕係とどのように話しますか？",
        "targetTimeSeconds": 45,
        "sentences": [
            {
                "speaker": "Зөөгч",
                "mn": "Сайн байна уу? Хэдүүлээ вэ?",
                "ja": "いらっしゃいませ。何名様ですか？",
                "romaji": "Sain baina uu? Kheduulee ve?",
                "clozeToken": "Хэдүүлээ",
                "clozeHint": "何人・何名様（集合数詞）",
                "explanation": "「Хэдүүлээ вэ?」は何名様ですか。"
            },
            {
                "speaker": "Зочин",
                "mn": "Сайн, сайн байна уу? Би ганцаараа байна.",
                "ja": "こんにちは。1人です。",
                "romaji": "Sain, sain baina uu? Bi gantsaaraa baina.",
                "clozeToken": "ганцаараа",
                "clozeHint": "1人で（副詞）",
                "explanation": "「Би ганцаараа байна」は1人です。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "За, энэ ширээнд суугаарай.",
                "ja": "では、こちらのテーブルへお掛けください。",
                "romaji": "Za, ene shireend suugaarai.",
                "clozeToken": "ширээнд",
                "clozeHint": "テーブル・机に（与位置格）",
                "explanation": "「энэ ширээнд суугаарай」はこちらのテーブルに座ってください。"
            },
            {
                "speaker": "Зочин",
                "mn": "Баярлалаа. Хоолны цэс авч болох уу?",
                "ja": "ありがとうございます。メニューをいただけますか？",
                "romaji": "Bayarlalaa. Khoolny tses avch bolokh uu?",
                "clozeToken": "цэс",
                "clozeHint": "メニュー・献立表（名詞）",
                "explanation": "「Хоолны цэс」はメニュー。「авч болох уу?」はもらえますか。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "Бололгүй  яах вэ. Та ямар хоол санал болгож вэ?",
                "ja": "もちろんです。どのようなお料理をご所望ですか？",
                "romaji": "Bololgui yaakh ve. Ta yamar khool sanal bolgoj ve?",
                "clozeToken": "санал",
                "clozeHint": "提案・希望（名詞）",
                "explanation": "「санал болгох」はお勧めする、提案する。"
            },
            {
                "speaker": "Зочин",
                "mn": "Баярлалаа. Энд ямар хоол нйртай вэ?",
                "ja": "ありがとうございます。ここではどんな料理が有名ですか？",
                "romaji": "Bayarlalaa. End yamar khool nertai ve?",
                "clozeToken": "нйртай",
                "clozeHint": "有名な・評判の（原文ママ：нйртай / нэртэй）",
                "explanation": "「нэртэй/нйртай」は有名な、名物な。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "Манай бууз, хуушуур, нэртэй байдаг.",
                "ja": "当店のボーズやホーショールが有名でございます。",
                "romaji": "Manai buuz, khuushuur, nertei baidag.",
                "clozeToken": "хуушуур",
                "clozeHint": "ホーショール（揚げパイ料理）",
                "explanation": "「бууз」は蒸し肉まん、「хуушуур」は揚げ肉パイ。"
            },
            {
                "speaker": "Зочин",
                "mn": "Бууз идмээр байна. Дөрвөн бууз авъя.",
                "ja": "ボーズが食べたいです。ボーズを4つください。",
                "romaji": "Buuz idmeer baina. Dorvon buuz avya.",
                "clozeToken": "Дөрвөн",
                "clozeHint": "4つの（数詞）",
                "explanation": "「Дөрвөн бууз авъя」はボーズを4つください。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "За. Та салат ч бас идэх үү?",
                "ja": "かしこまりました。サラダも召し上がりますか？",
                "romaji": "Za. Ta salat ch bas idekh uu?",
                "clozeToken": "салат",
                "clozeHint": "サラダ（名詞）",
                "explanation": "「салат ч бас」はサラダもまた。"
            },
            {
                "speaker": "Зочин",
                "mn": "Тийм ээ. Өндөгний салат авъя.",
                "ja": "はい。卵サラダをください。",
                "romaji": "Tiim ee. Ondognii salat avya.",
                "clozeToken": "Өндөгний",
                "clozeHint": "卵の（属格）",
                "explanation": "「Өндөгний салат」は卵サラダ。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "За. Та юу уух вэ?",
                "ja": "かしこまりました。お飲み物は何になさいますか？",
                "romaji": "Za. Ta yuu uukh ve?",
                "clozeToken": "уух",
                "clozeHint": "飲む（動詞）",
                "explanation": "「юу уух вэ?」は何を飲みますか。"
            },
            {
                "speaker": "Зочин",
                "mn": "Сүүтэй цай уумаар байна. Нэг сүүтэй цай авъя.",
                "ja": "スーテイチャイ（ミルクティー）が飲みたいです。ミルクティーを1杯ください。",
                "romaji": "Suutei tsai uumaar baina. Neg suutei tsai avya.",
                "clozeToken": "Сүүтэй цай",
                "clozeHint": "ミルクティー（モンゴル伝統茶）",
                "explanation": "「Сүүтэй цай」はモンゴルの伝統的な塩入りミルクティー。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "За. Өөр юм авах уу?",
                "ja": "はい。他にご注文はございますか？",
                "romaji": "Za. Oor yum avakh uu?",
                "clozeToken": "Өөр юм",
                "clozeHint": "他に何か（連語）",
                "explanation": "「Өөр юм авах уу?」は他にご注文はありますか。"
            },
            {
                "speaker": "Зочин",
                "mn": "Үгүй, баярлалаа.",
                "ja": "いいえ、以上で大丈夫です。",
                "romaji": "Ugui, bayarlalaa.",
                "clozeToken": "Үгүй",
                "clozeHint": "いいえ（返事）",
                "explanation": "「Үгүй, баярлалаа」はいいえ、結構です。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "За. Та түр хүлээгээрэй.",
                "ja": "かしこまりました。少々お待ちください。",
                "romaji": "Za. Ta tur khuleegeerei.",
                "clozeToken": "хүлээгээрэй",
                "clozeHint": "お待ちください（丁寧な命令）",
                "explanation": "「Та түр хүлээгээрэй」は少々お待ちください。"
            },
            {
                "speaker": "Зочин",
                "mn": "За, баярлалаа.",
                "ja": "はい、よろしくお願いします。",
                "romaji": "Za, bayarlalaa.",
                "clozeToken": "баярлалаа",
                "clozeHint": "ありがとう（挨拶）",
                "explanation": "「За, баярлалаа」ははい、ありがとう。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "Таны хоол бэлэн боллоо. Сайхан хооллоорой!",
                "ja": "お料理をお持ちしました（ご用意できました）。どうぞ美味しくお召し上がりください！",
                "romaji": "Tany khool belen bolloo. Saikhan khoollooroi!",
                "clozeToken": "хооллоорой",
                "clozeHint": "召し上がってください（挨拶）",
                "explanation": "「Сайхан хооллоорой!」は召し上がれ、いただきますの挨拶。"
            },
            {
                "speaker": "Зочин",
                "mn": "Баярлалаа. Хоол маш амттай байна.",
                "ja": "ありがとうございます。料理がとても美味しいです。",
                "romaji": "Bayarlalaa. Khool mash amttai baina.",
                "clozeToken": "амттай",
                "clozeHint": "美味しい（形容詞）",
                "explanation": "「Хоол маш амттай байна」は料理がとても美味しいです。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "баяртай байна. Дахиад цай авах уу?",
                "ja": "お気に召して嬉しいです。お茶のおかわりはいかがですか？",
                "romaji": "bayartai baina. Dakhiad tsai avakh uu?",
                "clozeToken": "Дахиад",
                "clozeHint": "もう一度・おかわり（副詞）",
                "explanation": "「Дахиад цай авах уу?」はお茶をもう一杯いかがですか。"
            },
            {
                "speaker": "Зочин",
                "mn": "Үгүй, баярлалаа. Би төлбөрөө хийе.",
                "ja": "いいえ、結構です。お会計をお願いします。",
                "romaji": "Ugui, bayarlalaa. Bi tolboroo khiie.",
                "clozeToken": "төлбөрөө",
                "clozeHint": "支払いを・会計を（再帰対格）",
                "explanation": "「Би төлбөрөө хийе」はお会計をします。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "Та картаар төлөх үү, бэлэн мөнгөөр төлөх үү?",
                "ja": "カードでお支払いですか、現金でお支払いですか？",
                "romaji": "Ta kartaar tolokh uu, belen mongeor tolokh uu?",
                "clozeToken": "бэлэн мөнгөөр",
                "clozeHint": "現金で（造格）",
                "explanation": "「бэлэн мөнгө」は現金。「бэлэн мөнгөөр」は現金で。"
            },
            {
                "speaker": "Зочин",
                "mn": "Картаар төлнө.",
                "ja": "カードで払います。",
                "romaji": "Kartaar tolno.",
                "clozeToken": "төлнө",
                "clozeHint": "支払います（動詞）",
                "explanation": "「Картаар төлнө」はカードで支払います。"
            },
            {
                "speaker": "Зөөгч",
                "mn": "За, баярлалаа. Дахин ирээрэй!",
                "ja": "はい、ありがとうございました。またお越しくださいませ！",
                "romaji": "Za, bayarlalaa. Dakhin ireerei!",
                "clozeToken": "Дахин ирээрэй",
                "clozeHint": "またお越しください（挨拶）",
                "explanation": "「Дахин ирээрэй!」はまた来てください。"
            },
            {
                "speaker": "Зочин",
                "mn": "Баярлалаа. Баяртай!",
                "ja": "ありがとうございました。さようなら！",
                "romaji": "Bayarlalaa. Bayartai!",
                "clozeToken": "Баяртай",
                "clozeHint": "さようなら（挨拶）",
                "explanation": "「Баярлалаа. Баяртай!」はごちそうさまでした、さようなら。"
            }
        ]
    },
    {
        "number": 13,
        "id": "topic_13",
        "category": "roleplay",
        "categoryLabel": "実践ロールプレイ対話",
        "icon": "🎫",
        "title": "切符売り場にて",
        "titleJa": "バスターミナルでの長距離切符購入",
        "titleMn": "Тасалбар авах газар",
        "description": "窓口係と乗客の対話：チョイバルサン行き長距離バス切符購入、出発日（明日朝8:00）、到着時刻（夕方18:00）、料金30,000トゥグルグ、乗り場案内、カード決済。",
        "examinerPromptMn": "Та тасалбар авах газарт очихдоо, ажилтантай юу гэж ярих вэ?",
        "examinerPromptJa": "切符売り場に行った際、係員とどのように話しますか？",
        "targetTimeSeconds": 45,
        "sentences": [
            {
                "speaker": "Кассчин",
                "mn": "Сайн байна уу? Танд яасан бэ?",
                "ja": "いらっしゃいませ。どのようなご用件でしょうか？",
                "romaji": "Sain baina uu? Tand yaasan be?",
                "clozeToken": "яасан",
                "clozeHint": "どうされましたか（過去形）",
                "explanation": "「Танд яасан бэ?」はどうされましたか、どのようなご用ですか。"
            },
            {
                "speaker": "Зорчигч",
                "mn": "Сайн ,сайн байна уу? Би Чойбалсан руу явмаар байна. Тасалбар байна уу?",
                "ja": "こんにちは。チョイバルサンへ行きたいのですが、切符はありますか？",
                "romaji": "Sain, sain baina uu? Bi Choibalsan ruu yavmaar baina. Tasalbar baina uu?",
                "clozeToken": "Тасалбар",
                "clozeHint": "切符・チケット（名詞）",
                "explanation": "「Чойбалсан руу」はチョイバルサンへ（方向格）。「Тасалбар」は切符。"
            },
            {
                "speaker": "Кассчин",
                "mn": "Тийм ээ, байна. Та хэзээ явах вэ?",
                "ja": "はい、ございます。いつ出発されますか？",
                "romaji": "Tiim ee, baina. Ta khezee yavakh ve?",
                "clozeToken": "хэзээ",
                "clozeHint": "いつ（疑問詞）",
                "explanation": "「хэзээ явах вэ?」はいつ出発しますか。"
            },
            {
                "speaker": "Зорчигч",
                "mn": "Би маргааш явна.",
                "ja": "明日出発します。",
                "romaji": "Bi margaash yavna.",
                "clozeToken": "маргааш",
                "clozeHint": "明日（副詞・名詞）",
                "explanation": "「маргааш」は明日。"
            },
            {
                "speaker": "Кассчин",
                "mn": "Та хэдэн цагт явах вэ?",
                "ja": "何時に出発されますか？",
                "romaji": "Ta kheden tsagt yavakh ve?",
                "clozeToken": "хэдэн цагт",
                "clozeHint": "何時に（連語）",
                "explanation": "「хэдэн цагт」は何時に。"
            },
            {
                "speaker": "Зорчигч",
                "mn": "Өглөө явахыг хүсэж байна. Өглөө автобус байна уу?",
                "ja": "朝出発したいです。朝のバスはありますか？",
                "romaji": "Ogloo yavakhig khusej baina. Ogloo avtobus baina uu?",
                "clozeToken": "автобус",
                "clozeHint": "バス（名詞）",
                "explanation": "「явахыг хүсэж байна」は出発したい。「автобус」はバス。"
            },
            {
                "speaker": "Кассчин",
                "mn": "Тийм ээ, өглөө 8:00 цагт автобус байна.",
                "ja": "はい、朝8時のバスがございます。",
                "romaji": "Tiim ee, ogloo 8:00 tsagt avtobus baina.",
                "clozeToken": "8:00",
                "clozeHint": "8時（時刻）",
                "explanation": "「өглөө 8:00 цагт」は朝8時に。"
            },
            {
                "speaker": "Зорчигч",
                "mn": "За, нэг тасалбар авъя. Тасалбар хэдэн төгрөг вэ?",
                "ja": "では切符を1枚ください。切符はおいくらですか？",
                "romaji": "Za, neg tasalbar avya. Tasalbar kheden togrog ve?",
                "clozeToken": "тасалбар",
                "clozeHint": "切符（名詞）",
                "explanation": "「нэг тасалбар авъя」は切符を1枚買います。"
            },
            {
                "speaker": "Кассчин",
                "mn": "Нэг тасалбар 30,000 төгрөг.",
                "ja": "切符1枚30,000トゥグルグです。",
                "romaji": "Neg tasalbar 30,000 togrog.",
                "clozeToken": "30,000",
                "clozeHint": "30,000（数詞）",
                "explanation": "「гучин мянган төгрөг」。"
            },
            {
                "speaker": "Зорчигч",
                "mn": "За. Автобус хэдэн цагт Чойбалсанд очих вэ?",
                "ja": "分かりました。バスは何時にチョイバルサンに到着しますか？",
                "romaji": "Za. Avtobus kheden tsagt Choibalsand ochikh ve?",
                "clozeToken": "очих",
                "clozeHint": "行く・到着する（動詞）",
                "explanation": "「Чойбалсанд очих」はチョイバルサンに着く。"
            },
            {
                "speaker": "Кассчин",
                "mn": "Орой 18:00 цагт очно.",
                "ja": "夕方18時に到着します。",
                "romaji": "Oroi 18:00 tsagt ochno.",
                "clozeToken": "18:00",
                "clozeHint": "18時（時刻）",
                "explanation": "「Орой 18:00 цагт」は夜18時に。"
            },
            {
                "speaker": "Зорчигч",
                "mn": "За, ойлголоо. Би хаанаас автобусанд суух вэ?",
                "ja": "はい、分かりました。どこからバスに乗ればよいですか？",
                "romaji": "Za, oilgoloo. Bi khaanaas avtobusand suukh ve?",
                "clozeToken": "суух",
                "clozeHint": "乗る・座る（動詞）",
                "explanation": "「хаанаас」はどこから。「автобусанд суух」はバスに乗る。"
            },
            {
                "speaker": "Кассчин",
                "mn": "Та автобусны буудлаас сууна.",
                "ja": "バスターミナル（乗り場）からご乗車ください。",
                "romaji": "Ta avtobusny buudlaas suuna.",
                "clozeToken": "буудлаас",
                "clozeHint": "停留所・乗り場から（奪格）",
                "explanation": "「автобусны буудал」はバス停、バスターミナル。"
            },
            {
                "speaker": "Зорчигч",
                "mn": "Баярлалаа. Би картаар төлж болох уу?",
                "ja": "ありがとうございます。カードで支払えますか？",
                "romaji": "Bayarlalaa. Bi kartaar tolj bolokh uu?",
                "clozeToken": "төлж болох уу",
                "clozeHint": "支払えますか（可能疑問）",
                "explanation": "「картаар төлж болох уу?」はカードで支払えますか。"
            },
            {
                "speaker": "Кассчин",
                "mn": "Бололгүй яах вэ. Картаар төлж болно.",
                "ja": "もちろんですとも。カードでお支払いいただけます。",
                "romaji": "Bololgui yaakh ve. Kartaar tolj bolno.",
                "clozeToken": "Бололгүй",
                "clozeHint": "もちろん（慣用句の一部）",
                "explanation": "「Бололгүй яах вэ」はもちろんですとも。"
            },
            {
                "speaker": "Зорчигч",
                "mn": "За, картаар төлнө.",
                "ja": "では、カードで払います。",
                "romaji": "Za, kartaar tolno.",
                "clozeToken": "төлнө",
                "clozeHint": "支払います（動詞）",
                "explanation": "「картаар төлнө」はカードで払います。"
            },
            {
                "speaker": "Кассчин",
                "mn": "За, таны тасалбар. Болгоомжтой яваарай.",
                "ja": "はい、こちらが切符です。お気をつけて行ってらっしゃいませ。",
                "romaji": "Za, tany tasalbar. Bolgoomjtoi yavaarai.",
                "clozeToken": "Болгоомжтой",
                "clozeHint": "気をつけて（副詞）",
                "explanation": "「Болгоомжтой яваарай」はお気をつけて行ってらっしゃい。"
            },
            {
                "speaker": "Зорчигч",
                "mn": "Баярлалаа. Баяртай!",
                "ja": "ありがとうございました。さようなら！",
                "romaji": "Bayarlalaa. Bayartai!",
                "clozeToken": "Баяртай",
                "clozeHint": "さようなら（挨拶）",
                "explanation": "「Баярлалаа. Баяртай!」はありがとうございます、さようなら。"
            }
        ]
    }
]

print("Defined all 13 canonical topics!")
