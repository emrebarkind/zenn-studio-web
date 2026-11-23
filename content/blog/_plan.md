# Blog planı: anahtar kelimeler ve sıradaki yazılar

SEO ajanı (`.claude/skills/seo-blog`) her çalıştığında bu dosyayı okur, en üstteki
`sırada` satırını yazar ve yayına alır, satırı `yazıldı` olarak işaretler ve gerekirse
listeye yeni fikir ekler. Sıra elle değiştirilebilir; ajan sıraya uyar.

Arama hacimleri tahminidir. Google Search Console bağlandığında gerçek sorgular buraya
eklenecek ve sıra ona göre düzenlenecek.

## Hedef aramalar (önem sırasıyla)

| Arama | Niyet | Hangi sayfa karşılar |
| --- | --- | --- |
| tekirdağ pilates, süleymanpaşa pilates | stüdyo arıyor | ana sayfa, /branslar/mat-pilates |
| tekirdağ reformer pilates | stüdyo arıyor | /branslar/reformer-pilates |
| tekirdağ spor salonu, tekirdağ gym | antrenman yeri arıyor | ana sayfa, /branslar/fonksiyonel-antrenman |
| tekirdağ kickboks | kurs arıyor | /branslar/kickboks |
| tekirdağ spinning | grup dersi arıyor | /branslar/spinning |
| tekirdağ personal trainer, tekirdağ özel ders, tekirdağ özel pilates dersi | birebir arıyor | /branslar/fonksiyonel-antrenman, /branslar/mat-pilates |
| tekirdağ grup pilates dersi, tekirdağ pilates kursu | grup arıyor | /branslar/mat-pilates, /branslar/spinning |
| reformer pilates nedir, mat pilates mı reformer mı | bilgi | blog |
| pilatese nereden başlanır, ilk pilates dersi | bilgi | blog |
| kickboks yeni başlayan, kadınlar için kickboks | bilgi | blog |
| fonksiyonel antrenman nedir | bilgi | blog |
| spinning kaç kalori, spinning dersi nasıl | bilgi | blog |
| online pilates dersi | bilgi + hizmet | blog, /online |

## Yazılar

| Durum | Başlık fikri | Ana arama | Branş |
| --- | --- | --- | --- |
| yazıldı | Tekirdağ'da pilatese başlamak: mat mı, reformer mı? | tekirdağ pilates | reformer-pilates |
| yazıldı | Reformer pilates nedir? İlk derste neler olur | tekirdağ reformer pilates | reformer-pilates |
| yazıldı | Grup derslerimiz nasıl işliyor? Mat Pilates ve Spinning, 8 ve 12 derslik paketler, sabah ve akşam grupları | tekirdağ grup pilates dersi | mat-pilates |
| yazıldı | Bireysel derslerimiz: tek başına ya da 6 kişiye kadar (Mat ve Reformer Pilates, Kickboks, Fonksiyonel antrenman) | tekirdağ özel ders | fonksiyonel-antrenman |
| yazıldı | Tekirdağ'da spor salonu mu, stüdyo mu? Sana uygun antrenmanı seçmek | tekirdağ spor salonu | fonksiyonel-antrenman |
| yazıldı | Kickboksa yeni başlayanlar: ilk ayda neler öğrenirsin | tekirdağ kickboks | kickboks |
| yazıldı | Spinning dersi nasıl geçer? Yeni başlayanlar için rehber | tekirdağ spinning | spinning |
| yazıldı | Fonksiyonel antrenman nedir, kimlere uygun? | tekirdağ personal trainer | fonksiyonel-antrenman |
| yazıldı | Evden online mat pilates: nasıl hazırlanılır | online pilates dersi | mat-pilates |
| yazıldı | Haftada kaç gün antrenman? Yeni başlayanlar için gerçekçi bir plan | tekirdağ spor | fonksiyonel-antrenman |
| yazıldı | Haftada kaç gün pilates ve spinning? Dersleri birlikte planlamak | tekirdağ pilates spinning | spinning |
| sırada | Pilates ve kickboks için ilk dersten önce: yanına ne alırsın, ne yersin, nasıl hazırlanırsın? | tekirdağ ilk ders | mat-pilates |
| sırada | Ders sonrası ve dinlenme günü: kaslar ağrırsa ne yapmalı? Yeni başlayan için sade rehber | kas ağrısı spor sonrası | fonksiyonel-antrenman |
| sırada | Antrenör nasıl seçilir? İlk görüşmede sorabileceğin 5 soru | tekirdağ antrenör | fonksiyonel-antrenman |
| sırada | Sabah mı akşam mı antrenman? Ders saatini seçerken nelere bakmalı | tekirdağ sabah antrenmanı | fonksiyonel-antrenman |

## Eksik bilgiler

Ajanın yazarken ihtiyaç duyup sitede bulamadığı bilgiler. Doldurulursa (src/content/site.ts)
yazılarda kullanılabilir.

- Otopark ya da ulaşım bilgisi
- Bir üye aynı pakette hem Mat Pilates hem Spinning derslerini karıştırabiliyor mu (paket bir branşa mı bağlı)?
