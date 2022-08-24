const { User, Playlist, Song } = require("../../db");
const registerSong = require("../db-register/register-song");

const createPlaylist = async (req, res, next) => {
    try {
        const { name, songs, userId } = req.body;
        const userDb = await User.findByPk(userId);
        const userPlaylist = await userDb.countPlaylists({where: {
            show: true
          }})
        console.log(userPlaylist)

        if (userDb.role === "Gratuito" && userPlaylist >= 1) {
            return res.send("Solo puedes tener una unica playlist siendo usuario Gratuito")
        }
        if (userDb) {
            const playlistDb = await Playlist.create({
                name
            });
            if (songs) {
            songs.map(async s => {
                const { song } = await registerSong(s.name, s.id);
                await playlistDb.addSong(song.id); 
            });
        };
        await userDb.addPlaylist(playlistDb.id);
        res.send("¡Tu playlist se ha creado exitosamente!");
    } else {
        res.send("Id de usuario invalido");
    }
    } catch (error) {
        next(error);
    };
};

const getAllPlaylist = async (req, res, next) => {
    try {
        const playlistsDb = await Playlist.findAll({
            where: { 
                show: true
            },
            include: [{
                model: Song
        }]
        })
        res.send(playlistsDb);
    } catch (error) {
        next(error);
    }
}

const addSongs = async (req, res, next) => {
    try {
        const { playlistId } = req.params;
        const { name, id } = req.body;
        const { song } = await registerSong(name, id);
        const playlistDb = await Playlist.findByPk(playlistId);
        await playlistDb.addSong(song.id);
        res.send("Cancion agregada a la playlist");
        } catch (error) {
        next(error);
    };
};

const removeSongs = async (req, res, next) => {
    try {
        
        const { playlistId } = req.params;
        const { name, id } = req.body;

        console.log(name, id)

        const { song } = await registerSong(name, id);

        const playlistDb = await Playlist.findByPk(playlistId);

        await playlistDb.removeSong(song.id);

        res.send("Cancion removida de la playlist");
        
    } catch (error) {
        next(error);
    }
}

const getUserPlaylist = async (req, res, next) => {
    try {
        const {id} = req.params;
        const playlistDb = await Playlist.findAll({
            where: {userId: id, show: true}, include:[{model: Song}]
        });
        if (playlistDb) {
            res.send(playlistDb);
        } else {
            res.send("No se encontro una playlist con es Id");
        }
    } catch (error) {
        next(error);
    };
};

const editPlaylist = async (req, res, next) => {
    try {
        const {id} = req.params;
        const { name } = req.body;
        const playlistDb = await Playlist.findByPk(id);
        if (name) {
            playlistDb.name = name;
        }
        await playlistDb.save();
        res.send("Playlist editada correctamente");
    } catch (error) {
        next(error);
    };
};

const deletePlaylist = async (req, res, next) => {
    try {
        const {id} = req.params;
        const playlistDb = await Playlist.findByPk(id);
        playlistDb.show = false;
        await playlistDb.save();
        res.send("Se ha eliminado la playlist correctamente");
    } catch (error) {
        next(error);
    };
};

module.exports = {
    createPlaylist,
    getAllPlaylist,
    addSongs,
    removeSongs,
    getUserPlaylist,
    editPlaylist,
    deletePlaylist,
};