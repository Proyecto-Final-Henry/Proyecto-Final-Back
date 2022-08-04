### Reviews

- POST "api/back-end/reviews/create" [ ]

  - recieves:
    - title
    - score
    - description
    - userId
    - resourceType (missing)
      - song, album, artist
      - para identificar con cuál tabla cruzar la review
      - para contenido creado por admins, promotores
    - resourceId
      - para asociarla con un recurso específico, ya sea de api o de db
  - returns:
    - review id

- ruta para borrado lógico de reviews (pendiente)

- PUT "api/back-end/reviews/**reviewId**" [ ]

  - para modificar una review
  - recieves:
    - review Id
    - description (changed)
    - score (changed)

- GET "api/back-end/reviews/**reviewId**" [ ]

  - para obtener una review específica
  - recieves:
    - review Id

- GET "api/back-end/reviews/user/**userId**"

  - para obtener todas las reseñas hechas por un usuario
  - recieves:
    - userId

- GET "api/back-end/reviews/artist/**artistId**"

  - para obtener todas las reseñas asociadas a un artista
  - recieves:
    - artistId

- GET "api/back-end/reviews/album/**albumId**"

  - para obtener todas las reseñas asociadas a un album
  - recieves:
    - albumId

- GET "api/back-end/reviews/song/**songId**"

  - para obtener todas las reseñas asociadas a una canción
  - recieves:
    - songId
