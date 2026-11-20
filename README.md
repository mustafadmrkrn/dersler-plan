# Dersler Plan (Ders Defteri)

Özel ders ve grup dersi takibi için tek dosyalık mobil web uygulaması (`index.html`).

- **Kayıt:** Öğrenci ya da grup bir kez kaydedilir, dersler takvime kendiliğinden eklenir.
- **Takvim:** Dersler yaptım, ertele ya da iptal olarak işaretlenir. Konu ve yorum yazılır.
- **Alacaklar ve Ödemeler:** Ödenmeyen dersler ayrı listelenir, ödemeler tarihiyle saklanır, yıllık tahsilat görülür.
- **Grafik:** Ay ay kazanç, kategoriye göre renkli.

## Kayıtlar nerede saklanır?

Kayıtlar kendi Google Drive'ındaki bir Google Sheets tablosunda tutulur. Uygulama ile tablo arasındaki köprü `apps-script/Code.gs` dosyasıdır (Google Apps Script). Tablo senin hesabında olduğu için hiçbir servise abonelik gerekmez.

### Kurulum

1. Google Drive'da yeni bir Google Sheets dosyası aç, adını `Ders Defteri` yap.
2. **Uzantılar > Apps Script** menüsünü aç, varsayılan kodu sil ve `apps-script/Code.gs` içeriğini yapıştır. En üstteki `KEY` satırına kendi gizli anahtarını yaz (uzun, rastgele bir metin).
3. **Dağıt > Yeni dağıtım > Web uygulaması**: *Şu kişi olarak çalıştır: Ben*, *Erişimi olanlar: Herkes*. Dağıt'a bas, izinleri onayla ve çıkan web uygulaması adresini kopyala.
4. Uygulamayı aç (GitHub Pages: Settings > Pages > `main` / root). Menüdeki **Bağlantı ayarları** bölümüne adresi ve gizli anahtarı yapıştır. Aynı pencerede telefon için bir bağlantı çıkar, onu telefonunda bir kez aç.

Tabloda `Öğrenciler`, `Dersler` ve `Ayarlar` sayfaları oluşur. Dersler sayfasını Excel gibi elle de düzenleyebilirsin.

### Gizlilik

Adresi ve gizli anahtarı bilen biri tabloya erişebilir. Anahtarı kimseyle paylaşma, depoya ya da bir mesaja yazma. Örnek veri uydurma isimlerle gelir.

## Claude içinde çalıştırma

Aynı `index.html` Claude'un artifact ortamında da çalışır. Orada kayıtlar Claude'un kendi veri deposuna yazılır.
