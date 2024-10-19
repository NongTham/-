const { readdirSync, fs } = require('fs');

module.exports = (client) => {
    client.handleComponents = async () => {
        const componentFolder = readdirSync('./components');
        for (const folder of componentFolder) {
            const componentFiles = readdirSync(`./components/${folder}`).filter(
                (file) => file.endsWith('.js'));

            const { buttons, selectMenus } = client;

            switch (folder) {
                case 'buttons':
                    for (const file of componentFiles) {
                        const button = require(`../../components/${folder}/${file}`);
                        buttons.set(button.data.name, button);
                    }
                    break;

                case 'dropdowns':
                    for (const file of componentFiles) {
                        const dropdown = require(`../../components/${folder}/${file}`);
                        selectMenus.set(dropdown.data.name, dropdown);
                    }
                    break;

                default:
                    break;
            }
        }
    };
    console.log(`[INFORMATION] Loading Components`)
};