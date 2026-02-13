import { IconType } from "react-icons";
import {
    FaReact,
    FaNode,
    FaNodeJs,
    FaPython,
    FaJava,
    FaPhp,
    FaRust,
    FaGolang,
    FaSwift,
    FaAngular,
    FaVuejs,
    FaHtml5,
    FaCss3,
    FaCss3Alt,
    FaSass,
    FaLess,
    FaBootstrap,
    FaJs,
    FaNpm,
    FaYarn,
    FaGit,
    FaGitAlt,
    FaGithub,
    FaGitlab,
    FaBitbucket,
    FaDocker,
    FaAws,
    FaGoogle,
    FaMicrosoft,
    FaApple,
    FaLinux,
    FaUbuntu,
    FaRedhat,
    FaCentos,
    FaFedora,
    FaSuse,
    FaDebian,
    FaFreebsd,
    FaWindows,
    FaAndroid,
    FaAppStore,
    FaAppStoreIos,
    FaGooglePlay,
    FaWordpress,
    FaDrupal,
    FaJoomla,
    FaMagento,
    FaShopify,
    FaSquarespace,
    FaWix,
    FaFigma,
    FaSketch,
    FaTrello,
    FaJira,
    FaConfluence,
    FaSlack,
    FaDiscord,
    FaStackOverflow,
    FaDev,
    FaMedium,
    FaHashnode,
    FaCodepen,
    FaMarkdown,
    FaCloudflare,
    FaDigitalOcean,
    FaRaspberryPi,
    FaUnity,
    FaDatabase,
    FaServer,
    FaTerminal,
    FaCode,
    FaCodeBranch,
    FaCodeCommit,
    FaCodeCompare,
    FaCodeFork,
    FaCodeMerge,
    FaCodePullRequest,
    FaCubes,
    FaCube,
    FaMicrochip,
    FaNetworkWired,
    FaSitemap,
    FaLaptopCode,
    FaMobileScreen,
    FaDesktop,
    FaCloud,
    FaHardDrive,
    FaMemory,
    FaBug,
    FaVial,
    FaFlask,
    FaRobot,
    FaBrain,
    FaChartLine,
    FaChartBar,
    FaChartPie,
    FaLock,
    FaShield,
    FaKey,
    FaFingerprint,
    FaGlobe,
    FaWifi,
    FaBluetooth,
    FaUsb,
    FaEthernet,
    FaSquareGithub,
    FaSquareGitlab,
} from "react-icons/fa6";

export const SKILL_ICONS = {
    /** Languages */
    javascript: FaJs,
    js: FaJs,
    python: FaPython,
    java: FaJava,
    php: FaPhp,
    rust: FaRust,
    go: FaGolang,
    golang: FaGolang,
    swift: FaSwift,

    /** Frontend Frameworks & Libraries */
    react: FaReact,
    angular: FaAngular,
    vue: FaVuejs,
    vuejs: FaVuejs,

    /** Web Technologies */
    html: FaHtml5,
    html5: FaHtml5,
    css: FaCss3,
    css3: FaCss3Alt,
    sass: FaSass,
    scss: FaSass,
    less: FaLess,
    bootstrap: FaBootstrap,
    markdown: FaMarkdown,

    /** Runtime & Package Managers */
    node: FaNode,
    nodejs: FaNodeJs,
    npm: FaNpm,
    yarn: FaYarn,

    /** Version Control */
    git: FaGit,
    "git-alt": FaGitAlt,
    github: FaGithub,
    "github-square": FaSquareGithub,
    gitlab: FaGitlab,
    "gitlab-square": FaSquareGitlab,
    bitbucket: FaBitbucket,

    /** DevOps & Containers */
    docker: FaDocker,

    /** Cloud Providers */
    aws: FaAws,
    amazon: FaAws,
    google: FaGoogle,
    gcp: FaGoogle,
    microsoft: FaMicrosoft,
    azure: FaMicrosoft,
    cloudflare: FaCloudflare,
    digitalocean: FaDigitalOcean,

    /** Operating Systems */
    linux: FaLinux,
    ubuntu: FaUbuntu,
    redhat: FaRedhat,
    centos: FaCentos,
    fedora: FaFedora,
    suse: FaSuse,
    debian: FaDebian,
    freebsd: FaFreebsd,
    windows: FaWindows,
    apple: FaApple,
    macos: FaApple,

    /** Mobile */
    android: FaAndroid,
    ios: FaApple,
    appstore: FaAppStore,
    "appstore-ios": FaAppStoreIos,
    playstore: FaGooglePlay,
    googleplay: FaGooglePlay,

    /** CMS & E-commerce */
    wordpress: FaWordpress,
    drupal: FaDrupal,
    joomla: FaJoomla,
    magento: FaMagento,
    shopify: FaShopify,
    squarespace: FaSquarespace,
    wix: FaWix,

    /** Design Tools */
    figma: FaFigma,
    sketch: FaSketch,

    /** Project Management & Collaboration */
    trello: FaTrello,
    jira: FaJira,
    confluence: FaConfluence,
    slack: FaSlack,
    discord: FaDiscord,

    /** Developer Communities */
    stackoverflow: FaStackOverflow,
    dev: FaDev,
    medium: FaMedium,
    hashnode: FaHashnode,
    codepen: FaCodepen,

    /** Game Engines */
    unity: FaUnity,

    /** Hardware */
    raspberrypi: FaRaspberryPi,
    microchip: FaMicrochip,
    memory: FaMemory,
    harddrive: FaHardDrive,

    /** Generic Development Icons */
    database: FaDatabase,
    db: FaDatabase,
    server: FaServer,
    terminal: FaTerminal,
    cli: FaTerminal,
    code: FaCode,
    "code-branch": FaCodeBranch,
    "code-commit": FaCodeCommit,
    "code-compare": FaCodeCompare,
    "code-fork": FaCodeFork,
    "code-merge": FaCodeMerge,
    "code-pr": FaCodePullRequest,
    "pull-request": FaCodePullRequest,

    /** Architecture & Infrastructure */
    cubes: FaCubes,
    microservices: FaCubes,
    cube: FaCube,
    network: FaNetworkWired,
    sitemap: FaSitemap,
    cloud: FaCloud,

    /** Devices */
    laptop: FaLaptopCode,
    mobile: FaMobileScreen,
    desktop: FaDesktop,

    /** Testing & Debugging */
    bug: FaBug,
    test: FaVial,
    flask: FaFlask,

    /** AI & Data */
    robot: FaRobot,
    ai: FaRobot,
    brain: FaBrain,
    ml: FaBrain,
    "chart-line": FaChartLine,
    analytics: FaChartLine,
    "chart-bar": FaChartBar,
    "chart-pie": FaChartPie,

    /** Security */
    lock: FaLock,
    security: FaShield,
    shield: FaShield,
    key: FaKey,
    fingerprint: FaFingerprint,
    auth: FaFingerprint,

    /** Connectivity */
    globe: FaGlobe,
    web: FaGlobe,
    wifi: FaWifi,
    bluetooth: FaBluetooth,
    usb: FaUsb,
    ethernet: FaEthernet,
} as const;

/** Type for valid skill icon names */
export type SkillIconName = keyof typeof SKILL_ICONS;

/** Array of all valid icon names (useful for validation) */
export const SKILL_ICON_NAMES = Object.keys(SKILL_ICONS) as SkillIconName[];

/** Helper to check if a string is a valid icon name */
export function isValidIconName(name: string): name is SkillIconName {
    return name in SKILL_ICONS;
}

/** Get icon by name with type safety */
export function getSkillIcon(name: SkillIconName | string | null | undefined): IconType | null {
    if (!name || !isValidIconName(name)) return null;
    return SKILL_ICONS[name];
}