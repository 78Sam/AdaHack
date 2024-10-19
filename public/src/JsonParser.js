function Parser(levelName) {
    fetch("./src/levels/${levelName}/config.json").then(function(resp) {
        return resp.json();
    })
}