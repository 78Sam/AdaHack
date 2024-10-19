function Parser{
    fetch("./src/levels/level1/config.json").then(function(resp) {
        return resp.json()
    })
    .then(function(data){
        console.log(data['ammo_types'])

    })
}