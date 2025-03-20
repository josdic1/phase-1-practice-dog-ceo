console.log('%c HI', 'color: firebrick');

const init = () => {
    let dogArray = [];
    const dogImageContainer = document.getElementById('dog-image-container');
    const breedDropdown = document.getElementById('breed-dropdown');

    // Fetch random images on page load
    fetch('https://dog.ceo/api/breeds/image/random/4')
        .then((r) => r.json())
        .then((data) => {
            dogArray = data.message;
            renderList(dogArray);
        });

    function renderList(dogs) {
        dogImageContainer.innerHTML = ''; // Clear existing images
        const ul = document.createElement('ul');
        dogs.forEach((dog) => {
            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = dog;
            img.alt = dog.split('/')[4] + " dog image";
            li.appendChild(img);
            li.innerHTML += `<br>${dog.split('/')[4]}`; // Display breed text below
            li.classList.add('myDogs');
            ul.appendChild(li);
        });
        dogImageContainer.appendChild(ul);
    }

    breedDropdown.addEventListener('change', (e) => {
        const filterValue = e.target.value.toLowerCase();

        // Fetch full breed list
        fetch('https://dog.ceo/api/breeds/list/all')
            .then(res => res.json())
            .then(data => {
                let breedList = Object.keys(data.message);
                let subBreedList = [];

                for (let breed in data.message) {
                    if (data.message[breed].length > 0) {
                        for (let subbreed of data.message[breed]) {
                            subBreedList.push(`${breed}/${subbreed}`);
                        }
                    } else {
                        subBreedList.push(breed);
                    }
                }

                // Filter breeds based on selection
                let filteredBreeds = subBreedList.filter(breed => breed.startsWith(filterValue));
                
                if (filteredBreeds.length > 0) {
                    // Fetch images for filtered breeds
                    Promise.all(filteredBreeds.map(breed =>
                        fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
                            .then(res => res.json())
                            .then(image => image.message)
                    )).then(filteredImages => {
                        renderList(filteredImages);
                    });
                } else {
                    renderList([]); // No results
                }
            });
    });

    // Click to change color
    dogImageContainer.addEventListener('click', (e) => {
        const clickedElement = e.target.closest('li');
        if (clickedElement) {
            clickedElement.style.color = 'fuchsia';
        }
    });
};

document.addEventListener('DOMContentLoaded', init);
