(function () {
    'use strict';

    var category = document.body.dataset.creative;
    var config = {
        cars: {
            label: 'Automotive campaigns',
            title: 'Cars that make an entrance',
            heroStrong: 'Drive', heroThin: 'the next', heroStrong2: 'Creative', heroThin2: 'forward',
            copy: 'From performance-led launches to lifestyle storytelling, we create automotive visuals with motion, confidence, and a clear point of view.',
            side: 'A selection of automotive campaigns, showroom stories, and high-energy car visuals.',
            folder: 'cars', exts: ['jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg']
        },
        gym: {
            label: 'Fitness & wellness campaigns',
            title: 'Energy you can feel',
            heroStrong: 'Shape', heroThin: 'a stronger', heroStrong2: 'Creative', heroThin2: 'every day',
            copy: 'We turn training, movement, and wellness into bold visual stories that motivate people to show up and keep going.',
            side: 'A collection of fitness identities, workout stories, and wellness-led digital creatives.',
            folder: 'gym', exts: ['jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg']
        },
        jewelry: {
            label: 'Jewelry campaigns',
            title: 'Details made unforgettable',
            heroStrong: 'Make', heroThin: 'every detail', heroStrong2: 'Shine', heroThin2: 'with purpose',
            copy: 'From delicate product stories to premium collection launches, we create elegant visuals that give every piece its moment.',
            side: 'A refined selection of luxury, product, and fashion-led jewelry creatives.',
            folder: 'jewelery', exts: ['png','png','png','png','png','png','png','png','png','png','png','png','png','png','png','png']
        },
        places: {
            label: 'Places & destination campaigns',
            title: 'Make people want to go',
            heroStrong: 'Bring', heroThin: 'places to', heroStrong2: 'Life', heroThin2: 'through design',
            copy: 'We build destination stories that turn spaces, cities, and experiences into visual invitations people want to follow.',
            side: 'A visual journey across destinations, travel experiences, and place-led storytelling.',
            folder: 'places', exts: ['jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg']
        },
        sports: {
            label: 'Sports campaigns',
            title: 'Built for the big moment',
            heroStrong: 'Raise', heroThin: 'the', heroStrong2: 'Game', heroThin2: 'with creativity',
            copy: 'We capture the pace, emotion, and competitive spirit of sport in campaigns that build momentum before the first whistle.',
            side: 'A high-impact collection of sports broadcasts, fan moments, and action-led campaign visuals.',
            folder: 'sports', exts: ['png','png','png','png','png','png','png','png','png','png','png','png','png','png','png','png']
        },
        toy: {
            label: 'Toy & kids campaigns',
            title: 'Big imagination starts here',
            heroStrong: 'Play', heroThin: 'with', heroStrong2: 'Big', heroThin2: 'ideas',
            copy: 'We make playful worlds feel tangible through colorful storytelling, memorable product moments, and joyful digital experiences.',
            side: 'A cheerful collection of playful product stories, interactive ideas, and imagination-led creatives.',
            folder: 'toy', exts: ['jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg','jpg']
        }
    };

    var data = config[category];
    if (!data) return;

    document.title = data.title + ' | Deepshitech';
    var heading = document.querySelector('.mil-banner-content h1');
    if (heading) {
        heading.innerHTML = '<span class="portfolio2-heading-line"><strong>' + data.heroStrong + '</strong> <span class="mil-thin">' + data.heroThin + '</span></span>' +
            '<span class="portfolio2-heading-line"><strong>' + data.heroStrong2 + '</strong> <span class="mil-thin">' + data.heroThin2 + '</span></span>';
    }
    var heroCopy = document.querySelector('.portfolio2-hero-copy');
    if (heroCopy) heroCopy.textContent = data.copy;
    var label = document.querySelector('.portfolio2-section-label');
    if (label) label.textContent = data.label;
    var galleryTitle = document.querySelector('.portfolio2-gallery-title');
    if (galleryTitle) galleryTitle.innerHTML = 'A collection of <span class="mil-thin">' + data.title.toLowerCase() + '</span>';
    var sideCopy = document.querySelector('.portfolio2-gallery-section .col-lg-4 p');
    if (sideCopy) sideCopy.textContent = data.side;

    var gallery = document.querySelector('.portfolio2-gallery');
    if (!gallery) return;
    gallery.setAttribute('aria-label', data.label);
    gallery.innerHTML = '';
    for (var i = 0; i < 16; i += 1) {
        var number = i + 1;
        var name = data.label.replace(/ campaigns?$/i, '') + ' creative - ' + number;
        var button = document.createElement('button');
        button.className = 'portfolio2-card';
        button.type = 'button';
        button.setAttribute('aria-label', name);
        var image = document.createElement('img');
        image.src = '../img/' + data.folder + '/' + data.folder + '%20creative%20-%20' + number + '.' + data.exts[i];
        image.alt = name;
        image.loading = 'lazy';
        button.appendChild(image);
        gallery.appendChild(button);
    }
}());
