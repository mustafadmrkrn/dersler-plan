# Dersler Plan (Ders Defteri)

Özel ders ve grup dersi takibi için tek dosyalık mobil web uygulaması (`index.html`).

- **Kayıt:** Öğrenci ya da grup bir kez kaydedilir, dersler takvime kendiliğinden eklenir.
- **Takvim:** Dersler yaptım, ertele ya da iptal olarak işaretlenir. Konu ve yorum yazılır.
- **Alacaklar ve Ödemeler:** Ödenmeyen dersler ayrı listelenir, ödemeler tarihiyle saklanır, yıllık tahsilat görülür.
- **Grafik:** Ay ay kazanç, kategoriye göre renkli.

## Önemli: kayıtlar nerede saklanıyor?

Uygulama kayıtları Claude artifact çalışma ortamının `db` ve `user` yetenekleriyle saklar. O ortamın dışında (örneğin GitHub Pages) açılırsa uygulama çalışır ama **kayıt saklamaz**, her açılışta örnek veriyle başlar. Gerçek kayıtlar için Claude içindeki canlı sürümü kullan.

Kendi adresinde kalıcı kayıt istenirse `boot()` içindeki `claude.use('db')` bölümü bir veritabanı hizmetiyle (örneğin Supabase) değiştirilmelidir.

Örnek veri uydurma isimlerle gelir.

## GitHub Pages ile açmak

Depo ayarlarında Settings > Pages > Source: Deploy from a branch > `main` / `(root)` seç.
