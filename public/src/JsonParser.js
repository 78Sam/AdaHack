
function Parser(level_name) {
    return fetch(`./src/levels/${level_name}/config.json`)
        .then((res) => res.text())
        .then((text) => {
            return JSON.parse(text);
        })
        .catch((e) => {
            console.error(e);
            return null;
        });
}