# Proyecto-Final-Back

## Routes

### Music routes

- GET 'api/back-end/music/search' []

  - Recibe (por query)
    - query STR (obligatorio)
    - filter STR (opcional):
      - artist
      - track (canción)
      - release_title (album)
  - Devuelve (10 resultados)
    - if(!filter)
      - name
      - id (necesario para búsquedas detalladas)
      - type (artist, track, release_title)
      - img
    - if(filter)
      - name
      - id (necesario para búsquedas detalladas)
      - img

- GET 'api/back-end/music/artist' []

  - Recibe
    - id (obligatorio)
  - Devuelve
    - desde api
      - name
      - img
      - releases (albums) ARR
        - title
        - main_release id
        - cover img
    - desde database **(pendiente)**
      - reviews

- GET 'api/back-end/music/album' []

  - Recibe
    - main_release id (obligatorio)
  - Devuelve
    - desde api
      - title
      - cover img
      - released (fecha)
      - tracklist
        - title
        - duration
        - position (número de track)
    - desde database **(pendiente)**
      - reviews

- GET 'api/back-end/music/track' []
  - Recibe
    - main_release id (obligatorio)
    - position (obligatorio)
  - Devuelve
    - desde api
      - title
      - duration
      - album
        - title
        - cover img
    - desde database **(pendiente)**
      - reviews
