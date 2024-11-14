const mockComics = {
    comics: [
        {
            id: 1,
            title: "The Amazing Spider-Man #1",
            issueNumber: 1,
            description: "The first appearance of Spider-Man! Peter Parker gets bitten by a radioactive spider and learns that with great power comes great responsibility.",
            pageCount: 32,
            thumbnail: {
                path: "https://i.annihil.us/u/prod/marvel/i/mg/d/40/5196582d03800",
                extension: "jpg"
            },
            price: 9.99,
            creators: ["Stan Lee", "Steve Ditko"],
            characters: ["Peter Parker", "J. Jonah Jameson"]
        },
        {
            id: 2,
            title: "X-Men #1",
            issueNumber: 1,
            description: "The X-Men make their debut! Professor X brings together young mutants to protect a world that fears and hates them.",
            pageCount: 32,
            thumbnail: {
                path: "https://i.annihil.us/u/prod/marvel/i/mg/6/20/51dd0a684f23b",
                extension: "jpg"
            },
            price: 12.99,
            creators: ["Stan Lee", "Jack Kirby"],
            characters: ["Cyclops", "Jean Grey", "Beast"]
        },
        {
            id: 3,
            title: "Avengers #1",
            issueNumber: 1,
            description: "Earth's Mightiest Heroes assemble! When Loki threatens the world, only the most powerful heroes can stop him.",
            pageCount: 48,
            thumbnail: {
                path: "https://i.annihil.us/u/prod/marvel/i/mg/5/a0/514a2ed3302f5",
                extension: "jpg"
            },
            price: 15.99,
            creators: ["Stan Lee", "Jack Kirby"],
            characters: ["Iron Man", "Thor", "Hulk"]
        },
        {
            id: 4,
            title: "Black Panther #1",
            issueNumber: 1,
            description: "T'Challa must defend Wakanda from both internal and external threats while proving himself worthy of the Black Panther mantle.",
            pageCount: 40,
            thumbnail: {
                path: "https://i.annihil.us/u/prod/marvel/i/mg/3/70/5a97824c8daa1",
                extension: "jpg"
            },
            price: 13.99,
            creators: ["Ta-Nehisi Coates", "Brian Stelfreeze"],
            characters: ["T'Challa", "Shuri"]
        },
        {
            id: 5,
            title: "Captain Marvel #1",
            issueNumber: 1,
            description: "Carol Danvers takes on the mantle of Captain Marvel and soars higher, further, faster than ever before!",
            pageCount: 36,
            thumbnail: {
                path: "https://i.annihil.us/u/prod/marvel/i/mg/c/80/5c7d0d4f05d30",
                extension: "jpg"
            },
            price: 11.99,
            creators: ["Kelly Sue DeConnick", "Dexter Soy"],
            characters: ["Carol Danvers", "Maria Rambeau"]
        }
    ],
    heroes: [
        {
            id: 1,
            name: "Spider-Man",
            description: "Your friendly neighborhood Spider-Man",
            modified: "2023-01-01",
            thumbnail: {
                path: "https://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b",
                extension: "jpg"
            },
            resourceURI: "https://api.marvel.com/heroes/1",
            comics: ["The Amazing Spider-Man #1", "Spider-Man #2"]
        }
    ]
}; 