/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LearningTopic, QuizQuestion, VideoResource, AnatomyPart } from '../types/ipas';

export const LAB_TOPICS: LearningTopic[] = [
  {
    id: 'kelistrikan',
    title: 'Energi dan Kelistrikan',
    subtitle: 'Rangkaian Seri, Rangkaian Paralel, dan Aliran Arus Listrik',
    icon: 'Zap',
    badge: 'Lab Fisika & Elektronika',
    learningObjectives: [
      'Menjelaskan komponen-komponen penyusun rangkaian listrik sederhana (baterai, saklar, kabel, dan lampu).',
      'Membedakan konsep rangkaian terbuka (lampu padam) dan rangkaian tertutup (arus mengalir, lampu menyala).',
      'Menganalisis perbedaan karakteristik rangkaian seri dan rangkaian paralel terhadap nyala lampu.',
      'Merancang dan menguji rangkaian listrik mandiri secara virtual dengan aman.'
    ],
    coreConcepts: [
      {
        title: 'Arus Listrik dan Rangkaian Tertutup',
        body: 'Arus listrik terjadi karena adanya aliran elektron dari kutub negatif ke kutub positif baterai (arah arus konvensional digambarkan dari kutub positif ke negatif). Agar arus dapat mengalir, seluruh jalur penghantar harus terhubung membentuk satu putaran utuh (rangkaian tertutup).',
        keyPoints: [
          'Kutub positif (+) baterai memiliki potensial lebih tinggi.',
          'Saklar berfungsi sebagai pemutus dan penyambung aliran arus listrik.',
          'Jika kabel terputus atau saklar terbuka, arus listrik terhenti (rangkaian terbuka).'
        ]
      },
      {
        title: 'Perbedaan Rangkaian Seri dan Paralel',
        body: 'Pada rangkaian seri, komponen dipasang berurutan tanpa percabangan. Arus yang melewati setiap lampu sama besar, namun tegangan terbagi sehingga nyala lampu lebih redup. Jika satu lampu mati, lampu lain ikut mati. Pada rangkaian paralel, komponen terpasang berjajar membentuk percabangan. Setiap lampu mendapatkan tegangan penuh baterai sehingga menyala sama terang, dan jika satu lampu padam, lampu di cabang lain tetap menyala.',
        keyPoints: [
          'Seri: Hemat kabel, nyala lebih redup, satu padam semua padam.',
          'Paralel: Butuh kabel lebih banyak, nyala terang maksimal, satu padam yang lain tetap menyala.'
        ]
      }
    ],
    labInstructions: [
      'Tarik baterai dan letakkan di atas meja praktik.',
      'Hubungkan kutub positif (+) baterai ke salah satu terminal saklar menggunakan kabel merah.',
      'Hubungkan terminal saklar yang lain ke terminal lampu.',
      'Hubungkan terminal lampu kedua kembali ke kutub negatif (-) baterai menggunakan kabel hitam.',
      'Klik tuas saklar untuk menutup rangkaian dan amati aliran partikel listrik serta nyala lampu!'
    ],
    reflectionQuestions: [
      'Mengapa lampu di rumah kita umumnya dirangkai secara paralel, bukan seri?',
      'Apa yang terjadi jika baterai langsung dihubungkan dari kutub positif ke kutub negatif tanpa melewati beban/lampu?'
    ]
  },
  {
    id: 'magnet',
    title: 'Magnet dan Kemagnetan',
    subtitle: 'Kutub Magnet, Garis Medan Magnet, Kompas, dan Uji Sifat Bahan',
    icon: 'Compass',
    badge: 'Lab Fisika & Gaya',
    learningObjectives: [
      'Mengidentifikasi dua kutub magnet (Kutub Utara dan Kutub Selatan).',
      'Membuktikan sifat interaksi dua kutub magnet: kutub senama tolak-menolak, kutub tidak senama tarik-menarik.',
      'Mengamati pola garis-garis medan magnet yang keluar dari kutub utara menuju kutub selatan.',
      'Menguji dan mengelompokkan benda di sekitar berdasarkan sifat kemagnetannya (feromagnetik, paramagnetik, dan diamagnetik).'
    ],
    coreConcepts: [
      {
        title: 'Gaya Magnet dan Medan Magnet',
        body: 'Magnet memiliki medan magnet, yaitu daerah di sekitar magnet yang masih dipengaruhi oleh gaya magnet. Kekuatan medan magnet paling besar berada di kedua ujungnya (kutub magnet). Garis medan magnet selalu berarah keluar dari kutub Utara (U/N) dan masuk menuju kutub Selatan (S).',
        keyPoints: [
          'Kutub senama (U-U atau S-S) saling tolak-menolak.',
          'Kutub berlawanan (U-S) saling tarik-menarik.',
          'Jarum kompas selalu menunjuk arah kutub medan magnet bumi.'
        ]
      },
      {
        title: 'Sifat Kemagnetan Bahan',
        body: 'Tidak semua benda dapat ditarik magnet. Bahan feromagnetik ditarik sangat kuat (besi, baja, nikel, kobalt). Bahan paramagnetik ditarik sangat lemah (aluminium, platina). Bahan diamagnetik tidak ditarik atau bahkan sedikit ditolak oleh magnet (kayu, plastik, kaca, karet).',
        keyPoints: [
          'Besi dan baja = Feromagnetik (ditarik kuat).',
          'Aluminium = Paramagnetik (ditarik sangat lemah).',
          'Kayu dan plastik = Diamagnetik (tidak ditarik magnet).'
        ]
      }
    ],
    labInstructions: [
      'Geser magnet batang 1 dan 2 untuk mengamati garis gaya medan magnet.',
      'Dekatkan kutub Utara ke kutub Selatan, rasakan gaya tarik-menarik.',
      'Putar magnet agar kutub Utara bertemu kutub Utara, amati gaya tolak-menolak.',
      'Dekatkan kompas ke dekat kutub magnet dan amati perputaran jarum kompas.',
      'Ambil benda uji (paku besi, klip baja, penggaris kayu, kaleng aluminium) dan dekatkan ke magnet untuk menguji sifat kemagnetannya.'
    ],
    reflectionQuestions: [
      'Mengapa jarum kompas selalu mengarah ke kutub utara dan selatan bumi?',
      'Jika sebuah magnet batang dipotong menjadi dua bagian, apakah kutub utara dan selatan akan terpisah?'
    ]
  },
  {
    id: 'kerangka',
    title: 'Kerangka & Sistem Gerak Manusia',
    subtitle: 'Anatomi Tulang, Sendi, dan Struktur Penopang Tubuh',
    icon: 'Bone',
    badge: 'Lab Anatomi & Biologi',
    learningObjectives: [
      'Menyebutkan bagian-bagian utama kerangka manusia (tengkorak, badan, dan anggota gerak).',
      'Menjelaskan fungsi utama rangka: memberi bentuk tubuh, menegakkan tubuh, melindungi organ vital, dan tempat pembentukan sel darah.',
      'Mengidentifikasi letak tulang-tulang penting seperti tengkorak, tulang rusuk, tulang paha, dan tulang hasta.',
      'Memahami macam-macam bentuk tulang (pipih, pipa, dan pendek).'
    ],
    coreConcepts: [
      {
        title: 'Fungsi Utama Rangka Manusia',
        body: 'Tubuh manusia memiliki sekitar 206 tulang pada orang dewasa yang membentuk sistem rangka. Rangka bertindak sebagai alat gerak pasif karena tidak dapat bergerak sendiri tanpa bantuan otot.',
        keyPoints: [
          'Melindungi organ vital: Tengkorak melindungi otak, tulang rusuk melindungi jantung & paru-paru.',
          'Tempat melekatnya otot rangka dan penimbunan kalsium/mineral.',
          'Sumsum tulang memproduksi sel darah merah dan putih.'
        ]
      }
    ],
    labInstructions: [
      'Gunakan kursor atau sentuhan jari untuk mengarahkan model kerangka.',
      'Klik pada bagian tulang tertentu untuk melihat nama anatomis, nama ilmiah, dan fungsinya.',
      'Buka mode "Tebak Tulang" untuk menguji kemampuanmu menemukan letak tulang yang diminta!'
    ],
    reflectionQuestions: [
      'Apa yang akan terjadi pada tubuh kita jika manusia tidak memiliki tulang?',
      'Bagaimana cara menjaga kesehatan tulang kita sejak usia sekolah dasar?'
    ]
  },
  {
    id: 'otot',
    title: 'Sistem Otot Manusia',
    subtitle: 'Kerja Otot Antagonis, Kontraksi, Relaksasi, dan Tendon',
    icon: 'Activity',
    badge: 'Lab Fisiologi Gerak',
    learningObjectives: [
      'Menjelaskan bahwa otot adalah alat gerak aktif yang dapat memendek (kontraksi) dan memanjang (relaksasi).',
      'Mendemonstrasikan kerja otot antagonis pada lengan atas (otot bisep dan trisep).',
      'Memahami peran tendon sebagai penghubung kuat antara otot dengan tulang.',
      'Mengetahui perbedaan 3 jenis otot: otot lurik (otot rangka), otot polos, dan otot jantung.'
    ],
    coreConcepts: [
      {
        title: 'Mekanisme Kerja Otot Antagonis',
        body: 'Otot bisep dan trisep bekerja secara berlawanan (antagonis). Saat kita menekuk siku (fleksi), otot bisep berkontraksi (menggembung dan memendek) sementara trisep berelaksasi (memanjang). Saat meluruskan siku (ekstensi), otot trisep berkontraksi sementara bisep berelaksasi.',
        keyPoints: [
          'Otot hanya dapat menarik tulang, tidak dapat mendorong tulang.',
          'Gerak siku dibantu oleh sendi engsel pada persendian siku.',
          'Kontraksi memerlukan energi dari makanan dan oksigen.'
        ]
      }
    ],
    labInstructions: [
      'Gerakkan slider "Sudut Tekukan Lengan" dari 0° (lurus) sampai 135° (menekuk penuh).',
      'Perhatikan bagaimana otot bisep membesar/menggembung saat ditekuk.',
      'Perhatikan bagaimana otot trisep mengencang saat lengan diluruskan.',
      'Klik tombol "Jelaskan Otot Antagonis" untuk mempelajari peran tendon dan sendi engsel.'
    ],
    reflectionQuestions: [
      'Mengapa kita membutuhkan dua otot berlawanan (bisep dan trisep) untuk menggerakkan lengan?',
      'Apakah otot jantung kita bekerja di bawah kesadaran atau secara otomatis?'
    ]
  },
  {
    id: 'pencernaan',
    title: 'Sistem Pencernaan Manusia',
    subtitle: 'Perjalanan Makanan, Organ Pencernaan, dan Fungsi Enzim',
    icon: 'Utensils',
    badge: 'Lab Biologi Tubuh',
    learningObjectives: [
      'Mengurutkan saluran pencernaan makanan dari mulut hingga anus secara tepat.',
      'Membedakan pencernaan mekanik (gigi & gerakan lambung) dan pencernaan kimiawi (bantuan enzim).',
      'Menjelaskan fungsi organ penting seperti lambung, usus halus, dan usus besar.',
      'Memahami proses penyerapan sari makanan di usus halus dan penyerapan air di usus besar.'
    ],
    coreConcepts: [
      {
        title: 'Urutan Saluran Pencernaan',
        body: 'Makanan yang kita makan mengalami perjalanan sepanjang kurang lebih 8-9 meter saluran pencernaan: Mulut -> Kerongkongan (gerak peristaltik) -> Lambung -> Usus Halus (duodenum, jejunum, ileum) -> Usus Besar -> Rektum -> Anus.',
        keyPoints: [
          'Mulut: Enzim ptialin (amilase) mengubah amilum menjadi glukosa.',
          'Lambung: Asam lambung (HCl) membunuh kuman, enzim pepsin menguraikan protein.',
          'Usus Halus: Tempat penyerapan sari-sari makanan oleh pembuluh darah.',
          'Usus Besar: Penyerapan kembali air dan pembusukan sisa makanan oleh bakteri E. coli.'
        ]
      }
    ],
    labInstructions: [
      'Klik tombol "Mulai Perjalanan Makanan" untuk memulai animasi bolus makanan.',
      'Gunakan tombol Jeda/Lanjut untuk mengamati proses di setiap organ.',
      'Klik langsung pada gambar organ mana pun untuk membaca fungsi dan enzim yang diproduksi.'
    ],
    reflectionQuestions: [
      'Mengapa kita dianjurkan mengunyah makanan sebanyak 20-30 kali sebelum menelannya?',
      'Apa yang terjadi jika usus besar kita tidak menyerap air secara optimal?'
    ]
  },
  {
    id: 'pernapasan',
    title: 'Sistem Pernapasan Manusia',
    subtitle: 'Mekanisme Inspirasi & Ekspirasi, Paru-paru, dan Pertukaran Gas Alveolus',
    icon: 'Wind',
    badge: 'Lab Fisiologi Pernapasan',
    learningObjectives: [
      'Mengidentifikasi organ-organ sistem pernapasan manusia dari hidung hingga alveolus.',
      'Menjelaskan mekanisme pernapasan dada (otot antar tulang rusuk) dan pernapasan perut (otot diafragma).',
      'Menganalisis perbedaan kondisi paru-paru dan rongga dada saat inspirasi (menghirup napas) dan ekspirasi (menghembuskan napas).',
      'Menjelaskan proses pertukaran oksigen (O2) dan karbon dioksida (CO2) di alveolus.'
    ],
    coreConcepts: [
      {
        title: 'Mekanisme Inspirasi dan Ekspirasi',
        body: 'Saat inspirasi (menghirup udara), otot diafragma berkontraksi menjadi mendatar dan otot antar tulang rusuk terangkat. Akibatnya volume rongga dada membesar, tekanan udara di dalam paru-paru turun menjadi lebih rendah dari udara luar, sehingga udara kaya oksigen masuk. Saat ekspirasi, otot diafragma berelaksasi melengkung ke atas, rongga dada mengecil, tekanan naik, dan udara kaya CO2 terdorong keluar.',
        keyPoints: [
          'Inspirasi: Diafragma mendatar, dada membesar, udara masuk.',
          'Ekspirasi: Diafragma melengkung, dada mengecil, udara keluar.',
          'Alveolus adalah kantung udara kecil berdinding tipis tempat difusi gas O2 dan CO2.'
        ]
      }
    ],
    labInstructions: [
      'Klik tombol "Inspirasi (Tarik Napas)" untuk melihat paru-paru mengembang dan diafragma mendatar.',
      'Klik tombol "Ekspirasi (Hembuskan Napas)" untuk melihat paru-paru mengempis.',
      'Klik pada bagian Alveolus untuk membuka visualisasi pertukaran molekul gas O2 dan CO2.'
    ],
    reflectionQuestions: [
      'Mengapa bernapas melalui hidung lebih sehat daripada bernapas melalui mulut?',
      'Apa fungsi lendir dan rambut-rambut halus (silia) di dalam rongga hidung?'
    ]
  },
  {
    id: 'peredaran_darah',
    title: 'Sistem Peredaran Darah',
    subtitle: 'Jantung 4 Ruang, Pembuluh Darah, dan Peredaran Darah Besar/Kecil',
    icon: 'Heart',
    badge: 'Lab Kardiovaskular',
    learningObjectives: [
      'Mengenal 4 ruang jantung manusia: serambi kanan, serambi kiri, bilik kanan, bilik kiri.',
      'Membedakan peredaran darah besar (jantung - seluruh tubuh - jantung) dan peredaran darah kecil (jantung - paru-paru - jantung).',
      'Mengetahui perbedaan pembuluh nadi (arteri) yang tebal dan elastis dengan pembuluh balik (vena) yang memiliki katup.'
    ],
    coreConcepts: [
      {
        title: 'Jantung dan Pembuluh Darah',
        body: 'Jantung memompa darah ke seluruh tubuh tanpa henti. Bagian kiri jantung memompa darah kaya oksigen (darah bersih) ke seluruh tubuh, sedangkan bagian kanan jantung memompa darah kaya karbon dioksida (darah kotor) ke paru-paru untuk dibersihkan.',
        keyPoints: [
          'Bilik kiri memiliki dinding paling tebal karena memompa darah ke seluruh tubuh.',
          'Darah bersih kaya O2 ditandai warna merah terang.',
          'Darah kotor kaya CO2 ditandai warna biru/merah gelap.'
        ]
      }
    ],
    labInstructions: [
      'Amati siklus denyut jantung 4 ruang.',
      'Gunakan tombol "Peredaran Darah Kecil" dan "Peredaran Darah Besar" untuk melihat jalur aliran darah beranimasi.',
      'Klik pada masing-masing ruang jantung untuk membaca tekanannya.'
    ],
    reflectionQuestions: [
      'Mengapa denyut jantung kita berdetak lebih cepat setelah berolahraga lari?',
      'Apa fungsi sel darah merah (eritrosit) dalam sistem peredaran darah?'
    ]
  },
  {
    id: 'organ_indra',
    title: 'Pancaindra Manusia',
    subtitle: 'Mata, Telinga, Hidung, Lidah, dan Kulit',
    icon: 'Eye',
    badge: 'Lab Sensorik Manusia',
    learningObjectives: [
      'Menjelaskan struktur dan bagian-bagian mata (kornea, iris, pupil, lensa, retina).',
      'Menjelaskan cara kerja telinga menangkap getaran suara menjadi sinyal pendengaran.',
      'Memahami fungsi reseptor rasa pada lidah dan saraf peraba pada kulit.'
    ],
    coreConcepts: [
      {
        title: 'Mata dan Pembentukan Bayangan',
        body: 'Cahaya masuk melalui kornea, diatur intensitasnya oleh pupil dan iris, dibiaskan oleh lensa mata agar jatuh tepat pada bintik kuning di retina. Saraf optik kemudian meneruskan sinyal bayangan terbalik ke otak untuk diterjemahkan menjadi bayangan tegak.',
        keyPoints: [
          'Iris memberi warna pada mata.',
          'Pupil membesar saat redup dan mengecil saat terang.',
          'Retina menangkap cahaya dan mengirim sinyal ke otak.'
        ]
      }
    ],
    labInstructions: [
      'Pilih organ indra yang ingin dipelajari (Mata atau Telinga).',
      'Uji respons pupil terhadap intensitas cahaya tinggi dan rendah.',
      'Klik bagian-bagian optik mata untuk membaca perannya dalam pembiasan cahaya.'
    ],
    reflectionQuestions: [
      'Mengapa mata kita merasa silau sesaat saat keluar dari ruangan gelap ke tempat terik matahari?'
    ]
  },
  {
    id: 'ekosistem',
    title: 'Ekosistem dan Lingkungan',
    subtitle: 'Rantai Makanan, Jaring-jaring Makanan, dan Piramida Makanan',
    icon: 'Trees',
    badge: 'Lab Ekologi & Lingkungan',
    learningObjectives: [
      'Mengidentifikasi peran organisme dalam rantai makanan: Produsen, Konsumen I, Konsumen II, dan Pengurai (Dekomposer).',
      'Menganalisis dampak kepunahan atau ledakan populasi salah satu organisme terhadap ekosistem.',
      'Memahami aliran energi dari matahari melalui produsen hingga konsumen puncak.'
    ],
    coreConcepts: [
      {
        title: 'Aliran Energi dan Keseimbangan Alam',
        body: 'Tumbuhan hijau bertindak sebagai produsen yang menghasilkan makanan sendiri melalui fotosintesis dengan bantuan sinar matahari. Hewan herbivora menjadi konsumen tingkat I, karnivora menjadi konsumen tingkat II/III, dan pengurai menguraikan sisa zat organik kembali ke tanah.',
        keyPoints: [
          'Matahari adalah sumber energi utama dalam ekosistem.',
          'Hanya sekitar 10% energi yang berpindah ke tingkat trofik berikutnya.',
          'Rantai makanan yang saling berkaitan membentuk jaring-jaring makanan.'
        ]
      }
    ],
    labInstructions: [
      'Susun organisme rantai makanan di sawah: Padi -> Belalang -> Katak -> Ular -> Elang.',
      'Uji simulasi apa yang terjadi jika populasi katak berkurang drastis akibat perburuan liar!'
    ],
    reflectionQuestions: [
      'Apa yang terjadi pada populasi padi jika ular sawah habis diburu oleh manusia?'
    ]
  },
  {
    id: 'bumi_antariksa',
    title: 'Bumi dan Antariksa',
    subtitle: 'Rotasi Bumi, Revolusi Bumi, Siang-Malam, dan Fase Bulan',
    icon: 'Globe',
    badge: 'Lab Astronomi Dasar',
    learningObjectives: [
      'Menjelaskan dampak rotasi bumi terhadap terjadinya siang dan malam serta gerak semu harian matahari.',
      'Menjelaskan dampak revolusi bumi dan kemiringan sumbu bumi terhadap perubahan musim.',
      'Memahami penyebab terjadinya gerhana matahari dan gerhana bulan.'
    ],
    coreConcepts: [
      {
        title: 'Rotasi dan Revolusi Bumi',
        body: 'Bumi berputar pada porosnya dari barat ke timur membutuhkan waktu 24 jam (rotasi), menyebabkan pergantian siang dan malam. Bumi juga mengelilingi matahari selama 365,25 hari (revolusi) dengan kemiringan sumbu 23,5 derajat.',
        keyPoints: [
          'Rotasi = 24 jam -> Terjadinya siang dan malam.',
          'Revolusi = 365,25 hari -> Terjadinya pergantian musim.',
          'Gerhana Matahari terjadi saat posisi Bulan berada di antara Matahari dan Bumi.'
        ]
      }
    ],
    labInstructions: [
      'Putar model bumi interaktif untuk mengamati bagian bumi yang terkena cahaya matahari (siang) dan bagian yang membelakangi (malam).',
      'Posisikan Bulan di antara Matahari dan Bumi untuk mengamati bayangan umbra dan penumbra pada gerhana matahari.'
    ],
    reflectionQuestions: [
      'Mengapa saat di Indonesia siang hari, di belahan bumi lain seperti Amerika sedang malam hari?'
    ]
  }
];

/* Anatomy detailed data */
export const SKELETON_PARTS: AnatomyPart[] = [
  {
    id: 'skull',
    name: 'Tulang Tengkorak',
    latinName: 'Cranium',
    system: 'kerangka',
    category: 'Rangka Kepala',
    function: 'Melindungi organ otak yang sangat lunak dan penting, serta membentuk struktur wajah.',
    funFact: 'Tengkorak tersusun atas 22 tulang yang saling menyatu erat melalui persendian mati yang disebut sutura.',
    highlightCoordinates: { x: 150, y: 35, width: 60, height: 60 }
  },
  {
    id: 'mandible',
    name: 'Rahang Bawah',
    latinName: 'Mandibula',
    system: 'kerangka',
    category: 'Rangka Kepala',
    function: 'Satu-satunya tulang di kepala yang dapat digerakkan secara bebas untuk mengunyah makanan dan berbicara.',
    highlightCoordinates: { x: 150, y: 78, width: 40, height: 20 }
  },
  {
    id: 'clavicle',
    name: 'Tulang Selangka',
    latinName: 'Clavicula',
    system: 'kerangka',
    category: 'Gelang Bahu',
    function: 'Menghubungkan lengan atas dengan batang tubuh dan menopang bahu agar dapat bergerak bebas.',
    highlightCoordinates: { x: 150, y: 105, width: 100, height: 15 }
  },
  {
    id: 'sternum',
    name: 'Tulang Dada',
    latinName: 'Sternum',
    system: 'kerangka',
    category: 'Rangka Badan',
    function: 'Tempat melekatnya tulang rusuk bagian depan dan melindungi jantung serta paru-paru dari benturan keras.',
    highlightCoordinates: { x: 150, y: 140, width: 25, height: 60 }
  },
  {
    id: 'ribs',
    name: 'Tulang Rusuk',
    latinName: 'Costae',
    system: 'kerangka',
    category: 'Rangka Badan',
    function: 'Membentuk sangkar dada untuk melindungi organ vital pernapasan dan jantung. Dapat bergerak mengembang saat bernapas.',
    funFact: 'Manusia memiliki 12 pasang tulang rusuk (7 pasang rusuk sejati, 3 pasang rusuk palsu, dan 2 pasang rusuk melayang).',
    highlightCoordinates: { x: 150, y: 150, width: 95, height: 70 }
  },
  {
    id: 'humerus',
    name: 'Tulang Lengan Atas',
    latinName: 'Humerus',
    system: 'kerangka',
    category: 'Anggota Gerak Atas',
    function: 'Menjadi tempat melekatnya otot bisep dan trisep, serta menghubungkan gelang bahu dengan persendian siku.',
    highlightCoordinates: { x: 85, y: 160, width: 22, height: 80 }
  },
  {
    id: 'radius_ulna',
    name: 'Tulang Pengumpil & Hasta',
    latinName: 'Radius & Ulna',
    system: 'kerangka',
    category: 'Anggota Gerak Atas',
    function: 'Tulang pengumpil (searah ibu jari) dan hasta (searah kelingking) memungkinkan telapak tangan memutar dan memegang benda.',
    highlightCoordinates: { x: 70, y: 240, width: 25, height: 80 }
  },
  {
    id: 'pelvis',
    name: 'Tulang Panggul',
    latinName: 'Pelvis',
    system: 'kerangka',
    category: 'Gelang Panggul',
    function: 'Menopang berat badan bagian atas saat berdiri atau duduk, serta melindungi organ pencernaan dan reproduksi.',
    highlightCoordinates: { x: 150, y: 250, width: 90, height: 50 }
  },
  {
    id: 'femur',
    name: 'Tulang Paha',
    latinName: 'Femur',
    system: 'kerangka',
    category: 'Anggota Gerak Bawah',
    function: 'Tulang terpanjang, terberat, dan terkuat di tubuh manusia yang menopang seluruh bobot tubuh saat berjalan, melompat, dan berlari.',
    funFact: 'Tulang paha mampu menahan beban hingga 30 kali bobot tubuh manusia dewasa!',
    highlightCoordinates: { x: 125, y: 340, width: 30, height: 110 }
  },
  {
    id: 'patella',
    name: 'Tulang Tempurung Lutut',
    latinName: 'Patella',
    system: 'kerangka',
    category: 'Anggota Gerak Bawah',
    function: 'Melindungi sendi lutut dan meningkatkan daya ungkit tendon otot kuadrisep saat meluruskan kaki.',
    highlightCoordinates: { x: 125, y: 410, width: 20, height: 20 }
  },
  {
    id: 'tibia_fibula',
    name: 'Tulang Kering & Tulang Betis',
    latinName: 'Tibia & Fibula',
    system: 'kerangka',
    category: 'Anggota Gerak Bawah',
    function: 'Tulang kering berukuran besar menahan beban utama kaki, sedangkan tulang betis di sampingnya menstabilkan pergelangan kaki.',
    highlightCoordinates: { x: 125, y: 460, width: 35, height: 100 }
  }
];

export const DIGESTIVE_ORGANS: AnatomyPart[] = [
  {
    id: 'mouth',
    name: 'Rongga Mulut',
    system: 'pencernaan',
    category: 'Pencernaan Awal',
    function: 'Menghaluskan makanan secara mekanik dengan gigi dan lidah, serta mencerna amilum secara kimiawi dengan enzim ptialin (amilase ludah).',
    mechanism: 'Makanan dikunyah menjadi gumpalan halus yang disebut bolus yang mudah ditelan.',
    funFact: 'Enzim ptialin mengubah zat tepung/karbohidrat menjadi gula sederhana, sehingga nasi yang dikunyah lama terasa manis!'
  },
  {
    id: 'esophagus',
    name: 'Kerongkongan (Esofagus)',
    system: 'pencernaan',
    category: 'Saluran Penghantar',
    function: 'Menyalurkan bolus makanan dari mulut menuju lambung menggunakan gerak bergelombang otot.',
    mechanism: 'Terjadi gerak peristaltik, yaitu gerakan meremas dan mendorong bolus ke bawah selama 5-8 detik tanpa tergantung gaya gravitasi.',
    funFact: 'Kamu tetap bisa menelan makanan meski dalam posisi berbaring karena kekuatan gerak peristaltik!'
  },
  {
    id: 'stomach',
    name: 'Lambung (Ventrikulus)',
    system: 'pencernaan',
    category: 'Pengolahan Kimiawi & Asam',
    function: 'Mencampur makanan dengan asam lambung (HCl) dan enzim pencernaan hingga menjadi bubur kental (kimus).',
    mechanism: 'Otot dinding lambung mengaduk kimus selama 2-4 jam. Enzim pepsin menguraikan protein menjadi pepton, renin mengendapkan kasein susu, dan asam klorida (HCl) membunuh bibit kuman penyakit.',
    funFact: 'Asam lambung memiliki pH sekitar 1.5 - 2.0, cukup asam untuk melarutkan logam tipis, namun lambung dilindungi lapisan lendir mukosa tebal!'
  },
  {
    id: 'liver_gallbladder',
    name: 'Hati & Kantung Empedu',
    system: 'pencernaan',
    category: 'Kelenjar Pembantu Pencernaan',
    function: 'Hati menghasilkan cairan empedu berwarna kehijauan yang disimpan di kantung empedu untuk mengemulsikan zat lemak.',
    mechanism: 'Cairan empedu disalurkan ke usus 12 jari agar enzim lipase dapat memecah lemak menjadi asam lemak dan gliserol.',
    funFact: 'Hati adalah organ internal terbesar di tubuh manusia dengan lebih dari 500 fungsi penting.'
  },
  {
    id: 'pancreas',
    name: 'Pankreas',
    system: 'pencernaan',
    category: 'Kelenjar Enzim Pencernaan',
    function: 'Memproduksi getah pankreas yang kaya tiga enzim penting: amilase, tripsin, dan lipase.',
    mechanism: 'Menetralkan asam kimus dari lambung dengan natrium bikarbonat dan menguraikan karbohidrat, protein, serta lemak.',
    funFact: 'Pankreas juga memproduksi hormon insulin yang mengatur kadar gula darah dalam tubuh.'
  },
  {
    id: 'small_intestine',
    name: 'Usus Halus (Intestinum)',
    system: 'pencernaan',
    category: 'Penyerapan Sari Makanan',
    function: 'Tempat penyelesaian pencernaan kimiawi dan penyerapan 90% sari-sari makanan ke dalam aliran darah.',
    mechanism: 'Terdiri dari usus 12 jari (duodenum), usus kosong (jejunum), dan usus penyerapan (ileum). Permukaannya dilapisi jutaan jonjot usus (vili) untuk memperluas bidang penyerapan nutrisi.',
    funFact: 'Panjang usus halus manusia rata-rata mencapai 6 hingga 7 meter jika dibentangkan!'
  },
  {
    id: 'large_intestine',
    name: 'Usus Besar (Kolon)',
    system: 'pencernaan',
    category: 'Penyerapan Air & Pembusukan',
    function: 'Menyerap kelebihan air dan mineral dari sisa makanan serta membusukkan ampas makanan dengan bantuan bakteri baik.',
    mechanism: 'Bakteri menguntungkan Escherichia coli membantu membusukkan ampas menjadi feses dan menghasilkan vitamin K penting.',
    funFact: 'Jika penyerapan air terganggu, feses bisa menjadi terlalu cair (diare) atau terlalu keras (sembelit).'
  },
  {
    id: 'rectum_anus',
    name: 'Rektum dan Anus',
    system: 'pencernaan',
    category: 'Pembuangan Akhir',
    function: 'Rektum berfungsi sebagai tempat penampungan sementara feses sebelum dikeluarkan melalui lubang anus yang dikendalikan otot sfingter.',
    mechanism: 'Saat rektum penuh, saraf mengirimkan sinyal rasa ingin buang air besar ke otak.',
    funFact: 'Otot anus memiliki katup ganda, satu bekerja secara otomatis dan satu lagi dapat dikendalikan dengan sadar.'
  }
];

export const RESPIRATORY_ORGANS: AnatomyPart[] = [
  {
    id: 'nasal_cavity',
    name: 'Rongga Hidung',
    system: 'pernapasan',
    category: 'Saluran Masuk Udara',
    function: 'Menyaring kotoran dan debu dengan rambut hidung, menghangatkan udara dingin dengan kapiler darah, dan melembapkan udara dengan selaput lendir.',
    funFact: 'Bernapas lewat hidung jauh lebih aman daripada lewat mulut karena udara telah melalui 3 tahapan pengkondisian alami!'
  },
  {
    id: 'pharynx_larynx',
    name: 'Faring & Laring',
    system: 'pernapasan',
    category: 'Percabangan & Pita Suara',
    function: 'Faring adalah persimpangan saluran napas dan makanan. Laring memiliki katup epiglotis yang menutup saluran napas saat menelan, serta pita suara.',
    funFact: 'Epiglotis mencegah kita tersedak saat menelan makanan!'
  },
  {
    id: 'trachea',
    name: 'Batang Tenggorokan (Trakea)',
    system: 'pernapasan',
    category: 'Saluran Utama Pernapasan',
    function: 'Pipa berongga yang tersusun dari cincin tulang rawan berbentuk huruf C, dilapisi silia (rambut getar) untuk menyapu debu keluar.',
    funFact: 'Silia bergerak seperti ombak kecil mendorong partikel debu ke atas menuju kerongkongan untuk dibatukkan atau ditelan.'
  },
  {
    id: 'bronchi',
    name: 'Bronkus & Bronkiolus',
    system: 'pernapasan',
    category: 'Percabangan Paru-Paru',
    function: 'Bronkus bercabang dua menuju paru-paru kanan dan paru-paru kiri, lalu bercabang lagi menjadi pipa-pipa lebih halus yang disebut bronkiolus.',
    funFact: 'Bercabang-cabang mirip seperti pohon terbalik, sehingga sering disebut pohon bronkial.'
  },
  {
    id: 'lungs',
    name: 'Paru-paru (Pulmo)',
    system: 'pernapasan',
    category: 'Organ Utama Pernapasan',
    function: 'Organ spons elastis yang mengembang saat menghirup oksigen dan mengempis saat mengeluarkan karbon dioksida.',
    funFact: 'Paru-paru kanan terdiri dari 3 gelambir (lobus), sedangkan paru-paru kiri hanya 2 gelambir karena memberi ruang bagi letak jantung!'
  },
  {
    id: 'alveoli',
    name: 'Alveolus',
    system: 'pernapasan',
    category: 'Tempat Pertukaran Gas',
    function: 'Kantung-kantung mikroskopis berdinding sangat tipis tempat oksigen (O2) berdifusi masuk ke sel darah merah dan karbon dioksida (CO2) dilepaskan.',
    funFact: 'Terdapat sekitar 300 juta alveolus di dalam kedua paru-paru kita!'
  },
  {
    id: 'diaphragm',
    name: 'Diafragma',
    system: 'pernapasan',
    category: 'Otot Utama Pernapasan Perut',
    function: 'Sekat otot melengkung pemisah rongga dada dan rongga perut. Saat berkontraksi diafragma mendatar, memperbesar volume rongga dada saat menarik napas.',
    funFact: 'Cegukan (hiccup) terjadi akibat kejang atau kontraksi tiba-tiba yang tidak disengaja pada otot diafragma kita!'
  }
];

export const TEST_MATERIALS_DATA = [
  {
    id: 'paku_besi',
    name: 'Paku Besi',
    type: 'feromagnetik' as const,
    behavior: 'ditarik_kuat' as const,
    icon: 'Hammer',
    description: 'Besi mengandung domain magnetis yang mudah teratur sehingga ditarik sangat kuat oleh magnet batang.',
    x: 480,
    y: 120
  },
  {
    id: 'klip_baja',
    name: 'Klip Kertas Baja',
    type: 'feromagnetik' as const,
    behavior: 'ditarik_kuat' as const,
    icon: 'Paperclip',
    description: 'Baja adalah paduan besi dan karbon yang memiliki sifat feromagnetik tinggi dan dapat dijadikan magnet buatan.',
    x: 480,
    y: 190
  },
  {
    id: 'kaleng_aluminium',
    name: 'Potongan Aluminium',
    type: 'paramagnetik' as const,
    behavior: 'ditarik_lemah' as const,
    icon: 'Package',
    description: 'Aluminium adalah paramagnetik, tarikannya terhadap magnet sangat lemah hingga hampir tidak terasa oleh tangan.',
    x: 480,
    y: 260
  },
  {
    id: 'balok_kayu',
    name: 'Balok Kayu Kecil',
    type: 'diamagnetik' as const,
    behavior: 'tidak_ditarik' as const,
    icon: 'Box',
    description: 'Kayu bukan logam dan tergolong diamagnetik, sama sekali tidak terpengaruh oleh gaya tarik magnet.',
    x: 480,
    y: 330
  },
  {
    id: 'penggaris_plastik',
    name: 'Penggaris Plastik',
    type: 'diamagnetik' as const,
    behavior: 'tidak_ditarik' as const,
    icon: 'Ruler',
    description: 'Plastik merupakan bahan isolator dan diamagnetik, tidak memiliki kutub magnetik sehingga tidak ditarik.',
    x: 480,
    y: 400
  }
];

/* Curated curriculum quiz questions */
export const QUIZ_DATABASE: QuizQuestion[] = [
  // Kelistrikan
  {
    id: 'q_listrik_1',
    category: 'kelistrikan',
    type: 'multiple-choice',
    question: 'Perhatikan kondisi berikut: Baterai, kabel, dan lampu sudah terhubung. Namun ketika saklar dibuka, lampu mati. Mengapa lampu mati saat saklar dibuka?',
    options: [
      'Aliran arus listrik terputus sehingga menjadi rangkaian terbuka',
      'Tegangan baterai tiba-tiba habis saat saklar terbuka',
      'Hambatan lampu menjadi nol sehingga tidak ada cahaya',
      'Kutub positif dan negatif baterai mengalami korsleting'
    ],
    correctAnswer: 0,
    explanation: 'Saat saklar dibuka, jalur kawat penghantar terputus sehingga rangkaian menjadi rangkaian terbuka. Arus listrik hanya dapat mengalir pada rangkaian tertutup utuh.'
  },
  {
    id: 'q_listrik_2',
    category: 'kelistrikan',
    type: 'multiple-choice',
    question: 'Dua buah lampu yang identik dipasang secara seri pada satu baterai 1,5V. Bagaimana nyala kedua lampu tersebut jika dibandingkan dengan satu lampu saja?',
    options: [
      'Nyala kedua lampu lebih redup karena tegangan baterai terbagi dua',
      'Nyala kedua lampu lebih terang karena arusnya menjadi berlipat ganda',
      'Satu lampu menyala sangat terang, lampu lainnya langsung putus',
      'Kedua lampu memiliki nyala yang persis sama terangnya dengan satu lampu'
    ],
    correctAnswer: 0,
    explanation: 'Pada rangkaian seri, tegangan total baterai terbagi ke masing-masing lampu (V_total = V1 + V2), sehingga daya pada tiap lampu lebih kecil dan nyala lampu menjadi lebih redup.'
  },
  {
    id: 'q_listrik_3',
    category: 'kelistrikan',
    type: 'true-false',
    question: 'Pada rangkaian paralel di rumah, apabila salah satu lampu di kamar mandi dimatikan, lampu di ruang tamu akan ikut padam.',
    options: ['Benar', 'Salah'],
    correctAnswer: 1,
    explanation: 'Salah! Pada rangkaian paralel, tiap lampu berada pada cabang sirkuit tersendiri. Mematikan satu cabang tidak memutus aliran arus pada cabang lainnya.'
  },

  // Magnet
  {
    id: 'q_magnet_1',
    category: 'magnet',
    type: 'multiple-choice',
    question: 'Jika kutub Utara sebuah magnet batang didekatkan ke kutub Utara magnet batang lainnya, peristiwa apa yang akan terjadi?',
    options: [
      'Kedua magnet akan tolak-menolak',
      'Kedua magnet akan tarik-menarik dengan kuat',
      'Kedua magnet tidak bereaksi sama sekali',
      'Kedua magnet akan kehilangan sifat kemagnetannya seketika'
    ],
    correctAnswer: 0,
    explanation: 'Kutub senama pada magnet (Utara bertemu Utara, atau Selatan bertemu Selatan) selalu tolak-menolak. Sedangkan kutub tidak senama (Utara bertemu Selatan) akan tarik-menarik.'
  },
  {
    id: 'q_magnet_2',
    category: 'magnet',
    type: 'multiple-choice',
    question: 'Benda di bawah ini yang termasuk bahan feromagnetik (dapat ditarik dengan kuat oleh magnet) adalah...',
    options: [
      'Paku besi dan klip kertas baja',
      'Balok kayu jati dan penggaris plastik',
      'Kertas karton dan penghapus karet',
      'Gelas kaca dan daun kering'
    ],
    correctAnswer: 0,
    explanation: 'Besi dan baja merupakan benda feromagnetik yang memiliki magnet elementer mudah diarahkan, sehingga ditarik sangat kuat oleh gaya magnet.'
  },

  // Kerangka
  {
    id: 'q_kerangka_1',
    category: 'kerangka',
    type: 'multiple-choice',
    question: 'Tulang yang bertindak melindungi organ vital jantung dan paru-paru dari benturan adalah...',
    options: [
      'Tulang dada dan tulang rusuk',
      'Tulang tengkorak dan tulang rahang',
      'Tulang panggul dan tulang kemaluan',
      'Tulang pengumpil dan tulang hasta'
    ],
    correctAnswer: 0,
    explanation: 'Tulang dada (sternum) bersama dengan 12 pasang tulang rusuk (costae) membentuk rongga sangkar dada yang kokoh untuk melindungi jantung dan paru-paru.'
  },
  {
    id: 'q_kerangka_2',
    category: 'kerangka',
    type: 'multiple-choice',
    question: 'Tulang terpanjang dan terkuat pada tubuh manusia yang menopang berat badan saat berjalan adalah...',
    options: [
      'Tulang paha (femur)',
      'Tulang lengan atas (humerus)',
      'Tulang betis (fibula)',
      'Tulang selangka (clavicula)'
    ],
    correctAnswer: 0,
    explanation: 'Tulang paha (femur) adalah tulang terpanjang dan terkuat di tubuh manusia karena harus menopang berat tubuh dan meredam gaya saat melompat atau berlari.'
  },

  // Otot
  {
    id: 'q_otot_1',
    category: 'otot',
    type: 'multiple-choice',
    question: 'Saat kita menekuk lengan ke atas sehingga telapak tangan mendekat ke bahu, bagaimanakah keadaan otot bisep dan trisep kita?',
    options: [
      'Otot bisep berkontraksi (memendek), otot trisep berelaksasi (memanjang)',
      'Otot bisep berelaksasi, otot trisep berkontraksi',
      'Kedua otot berkontraksi secara bersamaan',
      'Kedua otot sama-sama berelaksasi dan lemas'
    ],
    correctAnswer: 0,
    explanation: 'Otot bisep dan trisep bekerja secara antagonis (berlawanan). Saat menekuk lengan, bisep berkontraksi menggembung untuk menarik tulang pengumpil ke atas, sementara trisep berelaksasi.'
  },

  // Pencernaan
  {
    id: 'q_cerna_1',
    category: 'pencernaan',
    type: 'multiple-choice',
    question: 'Urutan saluran pencernaan makanan manusia yang benar dari awal sampai akhir adalah...',
    options: [
      'Mulut -> Kerongkongan -> Lambung -> Usus Halus -> Usus Besar -> Anus',
      'Mulut -> Tenggorokan -> Lambung -> Usus Besar -> Usus Halus -> Anus',
      'Mulut -> Kerongkongan -> Usus Halus -> Lambung -> Usus Besar -> Anus',
      'Mulut -> Lambung -> Kerongkongan -> Usus Halus -> Usus Besar -> Anus'
    ],
    correctAnswer: 0,
    explanation: 'Makanan masuk melalui mulut, ditelan melalui kerongkongan (esofagus), dicerna di lambung, diserap di usus halus, diserap airnya di usus besar, lalu sisa feses dikeluarkan melalui anus.'
  },
  {
    id: 'q_cerna_2',
    category: 'pencernaan',
    type: 'multiple-choice',
    question: 'Enzim ptialin yang terdapat di dalam air liur (saliva) pada rongga mulut berfungsi untuk mengubah...',
    options: [
      'Amilum (zat tepung) menjadi maltosa (gula sederhana)',
      'Protein menjadi asam amino',
      'Lemak menjadi asam lemak dan gliserol',
      'Susu menjadi kasein padat'
    ],
    correctAnswer: 0,
    explanation: 'Enzim amilase (ptialin) dalam air liur memecah rantai karbohidrat/amilum menjadi molekul gula sederhana, sehingga saat kita mengunyah nasi lama-kelamaan terasa manis di lidah.'
  },

  // Pernapasan
  {
    id: 'q_napas_1',
    category: 'pernapasan',
    type: 'multiple-choice',
    question: 'Apa yang terjadi pada otot diafragma dan rongga dada ketika kita melakukan inspirasi (menghirup udara)?',
    options: [
      'Otot diafragma berkontraksi mendatar dan volume rongga dada membesar',
      'Otot diafragma berelaksasi melengkung ke atas dan volume dada mengecil',
      'Otot diafragma tidak bergerak sama sekali',
      'Tulang rusuk turun ke bawah dan udara keluar dengan cepat'
    ],
    correctAnswer: 0,
    explanation: 'Saat inspirasi, diafragma berkontraksi mendatar dan otot antartulang rusuk terangkat, memperbesar volume rongga dada sehingga tekanan udara di paru-paru mengecil dan udara luar masuk.'
  },
  {
    id: 'q_napas_2',
    category: 'pernapasan',
    type: 'multiple-choice',
    question: 'Pertukaran gas oksigen (O2) dan karbon dioksida (CO2) di dalam paru-paru terjadi pada gelembung udara kecil yang bernama...',
    options: [
      'Alveolus',
      'Bronkiolus',
      'Trakea',
      'Faring'
    ],
    correctAnswer: 0,
    explanation: 'Alveolus memiliki dinding tipis berselapis tunggal yang dikelilingi oleh jaring kapiler darah, memungkinkan difusi gas O2 ke pembuluh darah dan pembuangan gas CO2.'
  }
];

export const VIDEO_RESOURCES: VideoResource[] = [
  {
    id: 'vid_listrik',
    title: 'Rangkaian Listrik Seri dan Paralel - IPAS Kelas 6',
    category: 'kelistrikan',
    description: 'Penjelasan tuntas mengenai perbedaan rangkaian seri dan paralel, arah arus listrik, dan cara menguji nyala lampu di rumah.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/g2q3z4iJt58',
    duration: '07:15',
    tags: ['Listrik', 'Seri', 'Paralel', 'Fase C']
  },
  {
    id: 'vid_magnet',
    title: 'Sifat-Sifat Magnet dan Garis Medan Magnet',
    category: 'magnet',
    description: 'Video demonstrasi gaya tarik dan tolak dua magnet batang, serbuk besi pembentuk garis gaya, dan cara membuat magnet sederhana.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/yXCueUk_bCU',
    duration: '06:40',
    tags: ['Magnet', 'Medan Magnet', 'Feromagnetik']
  },
  {
    id: 'vid_kerangka',
    title: 'Rangka Manusia dan Bagian-Bagian Tulang',
    category: 'kerangka',
    description: 'Belajar anatomi kerangka manusia lengkap: tengkorak, rangka badan, serta anggota gerak atas dan bawah untuk SD kelas 5 dan 6.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/a1b2c3d4e5f',
    duration: '08:20',
    tags: ['Rangka', 'Tulang', 'Anatomi']
  },
  {
    id: 'vid_pencernaan',
    title: 'Petualangan Makanan di Dalam Tubuh Kita',
    category: 'pencernaan',
    description: 'Animasi visual 3D sistem pencernaan makanan dari mulut, lambung, usus halus hingga menjadi energi untuk aktivitas sehari-hari.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/g9LvT8bLz90',
    duration: '09:05',
    tags: ['Pencernaan', 'Lambung', 'Enzim']
  },
  {
    id: 'vid_pernapasan',
    title: 'Bagaimana Paru-Paru dan Diafragma Kita Bekerja?',
    category: 'pernapasan',
    description: 'Mekanisme bernapas: inspirasi, ekspirasi, alveolus, serta tips menjaga kesehatan paru-paru dari polusi udara.',
    embedUrl: 'https://www.youtube-nocookie.com/embed/bB3kK9sL0mN',
    duration: '07:45',
    tags: ['Pernapasan', 'Paru-paru', 'Diafragma']
  }
];
