## MinIO

После первого `podman-compose up -d` или после `volume rm`/`restore`:

```sh
podman exec siftrate_minio_1 sh -c 'mc anonymous set download local/siftrate/media-covers'
```
