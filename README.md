# GitHub Stats Card

A customizable GitHub stats card generator that creates beautiful SVG cards showing your GitHub statistics, most used languages, contribution history, and top repositories.

![GitHub Stats](https://i.ibb.co/cFLcTrp/Screenshot-2024-12-03-131605.png)

## Features

- **Multiple Card Types**
  - GitHub Stats (followers, stars, repos, etc.)
  - Most Used Languages
  - Contribution Stats
  - Top Repositories

- **Customization Options**
  - Multiple chart types (bars, pie, donut)
  - Various themes:
    - Default Light/Dark
    - Tokyo Night
    - Dracula
    - Monokai
    - Aura
    - GitHub Dark
    - Solarized Dark
    - One Dark
    - Radical
    - Ocean
    - Forest
    - Sunset
    - Monochrome
    - Pastel

## Usage

1. Visit the website
2. Enter your GitHub username
3. Select your preferred card type
4. Choose a theme and chart style
5. Copy the generated markdown or HTML code
6. Paste it in your GitHub README or anywhere else!

### Quick Links

```markdown
![GitHub Stats](https://github-stats-card-generator.vercel.app/api/svg?username=YOUR_USERNAME)
![Top Languages](https://github-stats-card-generator.vercel.app/api/svg?username=YOUR_USERNAME&type=languages)
![Contributions](https://github-stats-card-generator.vercel.app/api/svg?username=YOUR_USERNAME&type=contributions)
![Top Repos](https://github-stats-card-generator.vercel.app/api/svg?username=YOUR_USERNAME&type=top-repos)
```

### Customization Parameters

- `username`: Your GitHub username
- `type`: Card type (`general`, `languages`, `contributions`, `top-repos`)
- `theme`: Theme name (e.g., `dracula`, `tokyonight`, `github`)
- `chart`: Chart type for stats and languages (`bars`, `pie`, `donut`)

## Development

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/getting-started).

### Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/github-stats-generator.git
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Start the development server

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

### Environment Variables

Create a `.env.local` file with:

```env
GITHUB_TOKEN=your_github_token
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by various GitHub stats generators
- Uses GitHub's API
- Built with Next.js and TypeScript
