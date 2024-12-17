import { useEffect, useRef, useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import GameStatus from './game/GameGenerationStatus.js'

function App() {
    const phaserRef = useRef();
    const [isAuto, setIsAuto] = useState(false);
    const [isFast, setIsFast] = useState(false);

    const generateLayer = () => {
        const cols = 5;
        const rows = 3;
        const itemCount = 13;
        let newLayer = [];
        for (let i = 0; i < rows; i++) {
            newLayer.push([]);
            for (let j = 0; j < cols; j++) {
                newLayer[i][j] = Math.floor(Math.random() * itemCount);
            }
        }
        return newLayer;
    }

    const setFastClickButton = (e) => {
        if (!isFast) e.target.classList.add("active");
        else e.target.classList.remove("active");

        const scene = phaserRef.current.scene;
        scene.IS_FAST_MODE = !isFast;
        setIsFast(!isFast);
    }

    const setAutoClickButton = (e) => {
        if (!isAuto) e.target.classList.add("active");
        else e.target.classList.remove("active");

        setIsAuto(!isAuto);
    }

    const changeLayer = () => {
        const scene = phaserRef.current.scene;
        const layer = generateLayer();
        
        layer[0][0] = 2;
        layer[1][2] = 2;
        layer[0][4] = 2;
        if (scene.IS_NEXT_GEN_COMPLETED)
            scene.setLayerItems({
                gameMap: layer,
                status: GameStatus.Winline,
                bonusColumn: 3,
                winLines: [
                    [1, 0, 2, 1, 2],
                    [0, 1, 0, 2, 1],
                ]
            });
    }

    useEffect(() => {
        if (!isAuto) return;
        const intervalId = setInterval(changeLayer, 1000);
        return () => clearInterval(intervalId);
    }, [isAuto]);
    
    return (
        <div id="app">
            <div id="helmet"></div>
            <div id="bottle"></div>

            <div id="game-menu">
                <div className="menu-item pointer">
                    <div id="icon-open-button">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 24H28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 16H28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M4 8H28" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </div>
                </div>
                <div className="menu-item pointer">
                    <div className="menu-text">BALANCE</div>
                    <div className="menu-score">1 000 000 ¥</div>
                </div>
                <div className="menu-item pointer">
                    <div className="menu-text">WIN</div>
                    <div className="menu-score">1 000 ¥</div>
                </div>
                <div className="menu-item pointer">
                    <div className="menu-text">TOTAL WIN</div>
                    <div className="menu-score">10 000 ¥</div>
                </div>
                <div className="menu-item pointer">
                    <div id="icon-music-button">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.5733 5.46667C16.3568 5.37299 16.1193 5.33844 15.885 5.36655C15.6508 5.39466 15.4282 5.48442 15.24 5.62667L8.86663 10.6667H3.99996C3.64634 10.6667 3.3072 10.8071 3.05715 11.0572C2.8071 11.3072 2.66663 11.6464 2.66663 12V20C2.66663 20.3536 2.8071 20.6928 3.05715 20.9428C3.3072 21.1929 3.64634 21.3333 3.99996 21.3333H8.86663L15.1733 26.3733C15.4079 26.5615 15.6992 26.6649 16 26.6667C16.1991 26.67 16.396 26.6242 16.5733 26.5333C16.8002 26.4253 16.9919 26.2553 17.1264 26.043C17.2609 25.8306 17.3326 25.5846 17.3333 25.3333V6.66667C17.3326 6.41535 17.2609 6.16935 17.1264 5.95704C16.9919 5.74472 16.8002 5.57473 16.5733 5.46667ZM14.6666 22.56L10.16 18.96C9.92537 18.7718 9.63405 18.6684 9.33329 18.6667H5.33329V13.3333H9.33329C9.63405 13.3316 9.92537 13.2282 10.16 13.04L14.6666 9.44V22.56ZM26.2133 8.45333C25.9622 8.20226 25.6217 8.06121 25.2666 8.06121C24.9116 8.06121 24.571 8.20226 24.32 8.45333C24.0689 8.7044 23.9278 9.04493 23.9278 9.4C23.9278 9.75507 24.0689 10.0956 24.32 10.3467C25.1051 11.1306 25.7186 12.0692 26.1215 13.103C26.5243 14.1368 26.7078 15.243 26.6601 16.3515C26.6125 17.4599 26.3348 18.5464 25.8447 19.5418C25.3546 20.5371 24.6628 21.4197 23.8133 22.1333C23.607 22.3097 23.4594 22.5449 23.3903 22.8074C23.3213 23.0699 23.334 23.3473 23.4267 23.6024C23.5195 23.8575 23.6879 24.0782 23.9095 24.235C24.131 24.3919 24.3952 24.4773 24.6666 24.48C24.9782 24.4806 25.2801 24.3721 25.52 24.1733C26.6545 23.2231 27.579 22.0471 28.2344 20.7202C28.8899 19.3933 29.2621 17.9445 29.3273 16.466C29.3925 14.9874 29.1493 13.5115 28.6132 12.1321C28.0771 10.7526 27.2598 9.49981 26.2133 8.45333ZM22.44 12.2267C22.3156 12.1023 22.1681 12.0037 22.0056 11.9365C21.8432 11.8692 21.6691 11.8345 21.4933 11.8345C21.3175 11.8345 21.1434 11.8692 20.981 11.9365C20.8185 12.0037 20.6709 12.1023 20.5466 12.2267C20.4223 12.351 20.3237 12.4986 20.2564 12.661C20.1891 12.8234 20.1545 12.9975 20.1545 13.1733C20.1545 13.3491 20.1891 13.5232 20.2564 13.6857C20.3237 13.8481 20.4223 13.9957 20.5466 14.12C21.0474 14.6178 21.3303 15.2939 21.3333 16C21.3336 16.3885 21.2491 16.7723 21.0855 17.1247C20.922 17.477 20.6835 17.7894 20.3866 18.04C20.2516 18.1519 20.14 18.2894 20.0582 18.4445C19.9764 18.5997 19.926 18.7694 19.9099 18.944C19.8938 19.1187 19.9123 19.2948 19.9644 19.4622C20.0164 19.6297 20.101 19.7853 20.2133 19.92C20.3262 20.054 20.4644 20.1645 20.62 20.2451C20.7756 20.3257 20.9455 20.3748 21.1201 20.3897C21.2947 20.4046 21.4706 20.3849 21.6375 20.3317C21.8045 20.2786 21.9594 20.193 22.0933 20.08C22.6894 19.5802 23.169 18.9559 23.4984 18.2511C23.8278 17.5463 23.999 16.778 24 16C23.9924 14.5868 23.4326 13.2326 22.44 12.2267Z" fill="white" />
                        </svg>
                    </div>
                </div>
            </div>
            <PhaserGame ref={phaserRef} />
            <div id="game-ui">
                <div id="game-mode" className="ui-area">
                    <div className="mode-item pointer disabled-select" onClick={setAutoClickButton}>AUTO</div>
                    <div className="mode-item pointer disabled-select" onClick={setFastClickButton}>FAST</div>
                </div>
                <div id="spin-area" className="ui-area">
                    <div className="spin-rate">
                        <svg width="87" height="87" viewBox="0 0 87 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.79798" y="0.79798" width="85.404" height="85.404" rx="9.20202" fill="#202020"/>
                            <rect x="0.79798" y="0.79798" width="85.404" height="85.404" rx="9.20202" fill="url(#paint0_radial_0_82)" fillOpacity="0.32"/>
                            <rect x="0.79798" y="0.79798" width="85.404" height="85.404" rx="9.20202" stroke="#FFCA57" strokeWidth="1.59596"/>
                            <path d="M2 7.00002L85 7M2 55L85 55M2 31L85 31M2 79L85 79M2 82L85 82M2 19L85 19M2 67L85 67M2 43L85 43M2 13L85 13M2 61L85 61M2 37L85 37M2 25L85 25M2 73L85 73M2 49L85 49M2 4.00002L85 4M2 52L85 52M2 28L85 28M2 76L85 76M2 16L85 16M2 64L85 64M2 40L85 40M2 10L85 10M2 58L85 58M2 34L85 34M2 22L85 22M2 70L85 70M2 46L85 46" stroke="#FFCA57" strokeOpacity="0.32"/>
                            <path d="M35.544 44.84V42.416L44.16 53H39.144L33 45.152H34.896L28.728 53H23.808L32.448 42.44V44.792L24.36 35H29.424L35.04 42.104H33.096L38.64 35H43.608L35.544 44.84ZM44.8808 41.336C44.9768 39.96 45.4248 38.776 46.2248 37.784C47.0248 36.776 48.0808 36 49.3928 35.456C50.7208 34.912 52.2248 34.64 53.9048 34.64C55.5048 34.64 56.9048 34.888 58.1048 35.384C59.3048 35.864 60.2408 36.544 60.9128 37.424C61.5848 38.304 61.9208 39.328 61.9208 40.496C61.9208 41.392 61.6888 42.224 61.2248 42.992C60.7608 43.76 60.0168 44.536 58.9928 45.32C57.9848 46.088 56.6408 46.92 54.9608 47.816L49.5128 50.816L49.2008 49.712H62.4248V53H45.1448V50.12L52.8488 45.608C54.1288 44.872 55.1288 44.24 55.8488 43.712C56.5688 43.168 57.0808 42.664 57.3848 42.2C57.6888 41.736 57.8408 41.24 57.8408 40.712C57.8408 40.152 57.6888 39.656 57.3848 39.224C57.0808 38.792 56.6248 38.456 56.0168 38.216C55.4248 37.976 54.6728 37.856 53.7608 37.856C52.6888 37.856 51.8088 38.016 51.1208 38.336C50.4328 38.64 49.9128 39.056 49.5608 39.584C49.2248 40.112 49.0248 40.696 48.9608 41.336H44.8808Z" fill="#FFCE00"/>
                            <defs>
                            <radialGradient id="paint0_radial_0_82" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(43.5 43.5) rotate(90) scale(55.0547)">
                            <stop stopColor="#FFE72D" stopOpacity="0"/>
                            <stop offset="0.525" stopColor="#FFF82D" stopOpacity="0.48"/>
                            <stop offset="1" stopColor="#FFC72D"/>
                            </radialGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="spin-button pointer disabled-select" onClick={changeLayer} >
                        <svg width="177" height="87" viewBox="0 0 177 87" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.79798" y="0.79798" width="175.404" height="85.404" rx="9.20202" fill="url(#paint0_radial_0_1)" fillOpacity="0.32" stroke="#97FF57" strokeWidth="1.59596"/>
                            <path d="M2 7.00002L173 7M2 55L173 55M2 31L173 31M2 79L173 79M2 82L173 82M2 19L173 19M2 67L173 67M2 43L173 43M2 13L173 13M2 61L173 61M2 37L173 37M2 25L173 25M2 73L173 73M2 49L173 49M2 4.00002L173 4M2 52L173 52M2 28L173 28M2 76L173 76M2 16L173 16M2 64L173 64M2 40L173 40M2 10L173 10M2 58L173 58M2 34L173 34M2 22L173 22M2 70L173 70M2 46L173 46" stroke="#97FF57" strokeOpacity="0.08"/>
                            <path d="M76.888 47.12H81.016C81.112 47.728 81.376 48.264 81.808 48.728C82.256 49.176 82.848 49.528 83.584 49.784C84.336 50.024 85.2 50.144 86.176 50.144C87.6 50.144 88.72 49.944 89.536 49.544C90.368 49.128 90.784 48.552 90.784 47.816C90.784 47.24 90.544 46.8 90.064 46.496C89.6 46.176 88.728 45.944 87.448 45.8L83.824 45.392C81.488 45.136 79.792 44.592 78.736 43.76C77.696 42.912 77.176 41.736 77.176 40.232C77.176 39.048 77.52 38.04 78.208 37.208C78.912 36.376 79.896 35.744 81.16 35.312C82.424 34.864 83.912 34.64 85.624 34.64C87.288 34.64 88.768 34.888 90.064 35.384C91.36 35.864 92.392 36.544 93.16 37.424C93.928 38.288 94.344 39.304 94.408 40.472H90.28C90.2 39.944 89.96 39.488 89.56 39.104C89.176 38.704 88.64 38.4 87.952 38.192C87.264 37.968 86.456 37.856 85.528 37.856C84.232 37.856 83.2 38.048 82.432 38.432C81.664 38.816 81.28 39.36 81.28 40.064C81.28 40.608 81.504 41.032 81.952 41.336C82.416 41.624 83.224 41.84 84.376 41.984L88.144 42.44C89.808 42.616 91.128 42.904 92.104 43.304C93.096 43.688 93.8 44.208 94.216 44.864C94.648 45.52 94.864 46.352 94.864 47.36C94.864 48.56 94.496 49.616 93.76 50.528C93.04 51.424 92.024 52.12 90.712 52.616C89.4 53.112 87.864 53.36 86.104 53.36C84.312 53.36 82.736 53.104 81.376 52.592C80.016 52.064 78.944 51.336 78.16 50.408C77.376 49.464 76.952 48.368 76.888 47.12ZM107.422 35C108.846 35 110.078 35.248 111.118 35.744C112.158 36.24 112.95 36.936 113.494 37.832C114.054 38.728 114.334 39.768 114.334 40.952C114.334 42.136 114.054 43.176 113.494 44.072C112.95 44.952 112.158 45.648 111.118 46.16C110.078 46.656 108.846 46.904 107.422 46.904H99.4778V43.544H107.206C108.15 43.544 108.886 43.312 109.414 42.848C109.958 42.384 110.23 41.752 110.23 40.952C110.23 40.136 109.958 39.504 109.414 39.056C108.886 38.592 108.15 38.36 107.206 38.36H99.8378L101.686 36.416V53H97.6058V35H107.422ZM116.707 35H120.787V53H116.707V35ZM141.145 50.312L139.729 50.528V35H143.689V53H138.529L127.009 37.472L128.401 37.256V53H124.465V35H129.745L141.145 50.312Z" fill="white"/>
                            <path d="M27 54.2853V45.4611M27 45.4611H36M27 45.4611L33.96 51.8733C35.5721 53.4547 37.5666 54.61 39.7572 55.2312C41.9479 55.8525 44.2633 55.9195 46.4876 55.4261C48.7118 54.9327 50.7723 53.8949 52.4768 52.4095C54.1813 50.9241 55.4743 49.0396 56.235 46.9318M60 30.7543V39.5784M60 39.5784H51M60 39.5784L53.04 33.1662C51.4279 31.5848 49.4334 30.4296 47.2428 29.8083C45.0521 29.1871 42.7367 29.12 40.5124 29.6134C38.2882 30.1069 36.2277 31.1447 34.5232 32.6301C32.8187 34.1154 31.5258 35.9999 30.765 38.1077" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            <defs>
                            <radialGradient id="paint0_radial_0_1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(88.5 43.5) rotate(90) scale(55.0547 112.008)">
                            <stop stopColor="#2DD9FF" stopOpacity="0"/>
                            <stop offset="0.525" stopColor="#2DFF3B" stopOpacity="0.48"/>
                            <stop offset="1" stopColor="#77FF2D"/>
                            </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App
