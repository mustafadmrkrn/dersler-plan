# Ders Defteri

Telefondan kullanılan ders takip uygulaması: öğrenci kaydı, takvim, ders konusu ve yorumu, erteleme/iptal, alacaklar, ödeme geçmişi ve aylık grafikler.

Tek dosya (`index.html`), GitHub Pages ile yayınlanır. Kayıtlar Supabase veritabanında (`ders_state` tablosu) tutulur. Her kullanıcı yalnızca kendi satırını okuyup yazabilir (satır düzeyinde güvenlik kuralı).

## Kullanım
1. Uygulamayı aç, e-posta ve şifreyle "Hesap oluştur"a bas, sonra giriş yap.
2. Giriş sonrası kayıtlar otomatik veritabanına yazılır. Telefonda ve bilgisayarda aynı hesapla aynı veriyi görürsün.

`apps-script/` klasörü, kayıtları Google Tablosu'nda tutan eski yöntemin kodudur. Artık kullanılmıyor.
