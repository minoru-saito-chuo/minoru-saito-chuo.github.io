// キャッシュ名を更新して古いキャッシュとの紐付けを切る
const CACHE_NAME = 'mocap-plus-migration-clear-v1';

self.addEventListener('install', (event) => {
    // 待機状態をスキップし、即座に新しいService Workerをインストール
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        // 保存されているすべてのキャッシュを削除
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('古いキャッシュを削除します:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            // クライアントの制御を即座に取得
            return self.clients.claim();
        }).then(() => {
            // 役目を終えたService Worker自身を登録解除
            return self.registration.unregister();
        })
    );
});