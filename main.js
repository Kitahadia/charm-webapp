document.getElementById('add-skin-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('skin-name').value;
    const description = document.getElementById('skin-description').value;
    const price = document.getElementById('skin-price').value;

    fetch('/skins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, description, price })
    })
    .then(response => response.json())
    .then(skin => {
        console.log('Скин добавлен:', skin);
        loadSkins();
    });
});

function loadSkins() {
    fetch('/skins')
        .then(response => response.json())
        .then(skins => {
            const skinList = document.getElementById('skin-list');
            skinList.innerHTML = '';
            skins.forEach(skin => {
                const div = document.createElement('div');
                div.textContent = `${skin.name} - ${skin.price}₽`;
                skinList.appendChild(div);
            });
        });
}

loadSkins();
