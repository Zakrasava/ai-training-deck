import type { ComponentType, ReactNode } from "react";
import sculpture from "@/sculpture/sculpture-dark.webp";
import { Step as StepperStep } from "@/bits/Stepper/Stepper";

/* Палитра колоды */
export const P = { ink: "#05070b", navy: "#0d1c44", blue: "#2f63f5", sky: "#6ccbff", ice: "#ddebff", fog: "#b7c0cf", white: "#edf1f7" };

export type Group = "Фоны" | "Карточки и рамки" | "Текст" | "Микро";
export type Entry = {
  name: string;
  group: Group;
  hint: string;                                  // куда это может пойти в колоде
  demo?: (C: ComponentType<any>) => ReactNode;   // как показать; без demo — рендер по умолчанию
  box?: "full" | "center";                       // full — на всю сцену; center — в центре
};

const cardBody = (
  <div className="w-[420px] p-[28px]">
    <p className="m-0 text-[13px] tracking-[.12em] uppercase text-mute">Настройка 3</p>
    <h3 className="m-0 mt-[10px] text-[30px] font-medium leading-[1.1] text-white">Память и история чатов</h3>
    <p className="m-0 mt-[12px] text-[17px] leading-[1.45] text-fog">Что ассистент о вас помнит, как это посмотреть и что удалить.</p>
  </div>
);

export const entries: Entry[] = [
  /* ---------- Фоны ---------- */
  { name: "Aurora", group: "Фоны", hint: "разделы, финал", demo: C => <C colorStops={[P.navy, P.blue, P.sky]} amplitude={1.0} blend={0.6} /> },
  { name: "SoftAurora", group: "Фоны", hint: "тихие слайды", demo: C => <C color1={P.blue} color2={P.sky} /> },
  { name: "Silk", group: "Фоны", hint: "разделы", demo: C => <C color={P.blue} speed={4} scale={1} noiseIntensity={1.2} rotation={0} /> },
  { name: "Prism", group: "Фоны", hint: "титул, финал", demo: C => <C animationType="rotate" timeScale={0.4} height={3.5} baseWidth={5.5} scale={3.4} hueShift={0} colorFrequency={1} noise={0.3} glow={1} /> },
  { name: "Galaxy", group: "Фоны", hint: "титул, финал", demo: C => <C mouseRepulsion mouseInteraction density={1.2} glowIntensity={0.4} saturation={0.6} hueShift={220} /> },
  { name: "DarkVeil", group: "Фоны", hint: "разделы", demo: C => <C color={P.blue} speed={0.5} /> },
  { name: "Beams", group: "Фоны", hint: "разделы", demo: C => <C beamWidth={2} beamHeight={15} beamNumber={12} lightColor={P.sky} speed={2} noiseIntensity={1.75} scale={0.2} rotation={0} /> },
  { name: "LightRays", group: "Фоны", hint: "титул, карта ступеней", demo: C => <C raysOrigin="top-center" raysColor={P.sky} raysSpeed={1.5} lightSpread={0.8} rayLength={1.2} followMouse mouseInfluence={0.1} noiseAmount={0.1} distortion={0.05} /> },
  { name: "Threads", group: "Фоны", hint: "тихие слайды", demo: C => <C color={[0.42, 0.8, 1]} amplitude={1} distance={0} enableMouseInteraction /> },
  { name: "Plasma", group: "Фоны", hint: "разделы", demo: C => <C color={P.blue} speed={0.6} direction="forward" scale={1.1} opacity={0.8} mouseInteractive /> },
  { name: "PlasmaWave", group: "Фоны", hint: "разделы", demo: C => <C color1={P.blue} color2={P.sky} /> },
  { name: "LiquidChrome", group: "Фоны", hint: "титул (ярко)", demo: C => <C baseColor={[0.05, 0.12, 0.35]} speed={0.3} amplitude={0.5} interactive /> },
  { name: "LiquidEther", group: "Фоны", hint: "титул, финал", demo: C => <C colors={[P.navy, P.blue, P.sky]} mouseForce={20} cursorSize={100} isViscous viscous={30} autoDemo autoSpeed={0.5} autoIntensity={2.2} /> },
  { name: "Hyperspeed", group: "Фоны", hint: "финал, «две папки»" },
  { name: "Iridescence", group: "Фоны", hint: "разделы", demo: C => <C color={[0.3, 0.5, 1]} mouseReact amplitude={0.1} speed={1} /> },
  { name: "Lightning", group: "Фоны", hint: "акцентный слайд", demo: C => <C hue={220} xOffset={0} speed={1} intensity={1} size={1} /> },
  { name: "FloatingLines", group: "Фоны", hint: "тихие слайды" },
  { name: "GridScan", group: "Фоны", hint: "настройки, демо", demo: C => <C linesColor={P.blue} scanColor={P.sky} /> },
  { name: "LightPillar", group: "Фоны", hint: "разделы", demo: C => <C topColor={P.sky} bottomColor={P.blue} /> },
  { name: "Lightfall", group: "Фоны", hint: "разделы", demo: C => <C colors={[P.blue, P.sky, P.ice]} /> },
  { name: "Grainient", group: "Фоны", hint: "тихие слайды", demo: C => <C colors={[P.ink, P.navy, P.blue, P.sky]} /> },
  { name: "Dither", group: "Фоны", hint: "ретро-акцент", demo: C => <C waveColor={[0.2, 0.4, 1]} disableAnimation={false} enableMouseInteraction mouseRadius={0.3} colorNum={4} waveAmplitude={0.3} waveFrequency={3} waveSpeed={0.05} /> },
  { name: "FaultyTerminal", group: "Фоны", hint: "слайд про агента/терминал", demo: C => <C scale={1.5} gridMul={[2, 1]} digitSize={1.2} timeScale={1} pause={false} scanlineIntensity={1} glitchAmount={1} flickerAmount={1} noiseAmp={1} chromaticAberration={0} dither={0} curvature={0} tint={P.sky} mouseReact mouseStrength={0.5} pageLoadAnimation brightness={0.6} /> },
  { name: "RippleGrid", group: "Фоны", hint: "настройки", demo: C => <C enableRainbow={false} gridColor={P.sky} rippleIntensity={0.05} gridSize={10} gridThickness={15} mouseInteraction mouseInteractionRadius={1.2} opacity={0.8} /> },
  { name: "Waves", group: "Фоны", hint: "тихие слайды", demo: C => <C lineColor={P.blue} backgroundColor="rgba(0,0,0,0)" waveSpeedX={0.02} waveSpeedY={0.01} waveAmpX={40} waveAmpY={20} friction={0.9} tension={0.01} maxCursorMove={120} xGap={12} yGap={36} /> },
  { name: "PixelBlast", group: "Фоны", hint: "акцентный слайд", demo: C => <C variant="circle" pixelSize={6} color={P.sky} patternScale={3} patternDensity={1.2} pixelSizeJitter={0.5} enableRipples rippleSpeed={0.4} rippleThickness={0.12} rippleIntensityScale={1.5} liquid liquidStrength={0.12} liquidRadius={1.2} liquidWobbleSpeed={5} speed={0.6} edgeFade={0.25} transparent /> },
  { name: "LaserFlow", group: "Фоны", hint: "титул, финал", demo: C => <C color={P.sky} /> },
  { name: "ColorBends", group: "Фоны", hint: "разделы", demo: C => <C colors={[P.navy, P.blue, P.sky, P.ice]} /> },
  { name: "Topography", group: "Фоны", hint: "слайд про землю/участки", demo: C => <C color={P.blue} /> },
  { name: "Strands", group: "Фоны", hint: "тихие слайды", demo: C => <C colors={[P.navy, P.blue, P.sky]} /> },
  { name: "GhostFibers", group: "Фоны", hint: "тихие слайды", demo: C => <C glowColor={P.sky} lineColor={P.blue} secondaryColor={P.navy} /> },
  { name: "FluxLines", group: "Фоны", hint: "разделы", demo: C => <C colors={[P.navy, P.blue, P.sky]} /> },
  { name: "SideRays", group: "Фоны", hint: "разделы", demo: C => <C rayColor1={P.blue} rayColor2={P.sky} /> },
  { name: "LightTunnel", group: "Фоны", hint: "финал", demo: C => <C cableColor={P.blue} pulseColor={P.sky} tunnelColor={P.navy} /> },
  { name: "ElasticMesh", group: "Фоны", hint: "карта ступеней", demo: C => <C text="Агент" color={P.blue} /> },
  { name: "Orb", group: "Фоны", hint: "слайд «правило ноль»", box: "full", demo: C => <C colors={[P.navy, P.blue, P.sky]} size={0.6} hoverIntensity={0.5} rotateOnHover followCursor /> },
  { name: "Particles", group: "Фоны", hint: "любой слайд", demo: C => <C particleColors={[P.sky, P.ice]} particleCount={300} particleSpread={10} speed={0.1} particleBaseSize={100} moveParticlesOnHover alphaParticles={false} disableRotation={false} /> },
  { name: "DotGrid", group: "Фоны", hint: "настройки", demo: C => <C dotSize={5} gap={15} baseColor={"#1b2a4a"} activeColor={P.sky} proximity={120} shockRadius={250} shockStrength={5} resistance={750} returnDuration={1.5} /> },
  { name: "Balatro", group: "Фоны", hint: "акцентный слайд", demo: C => <C isRotate={false} mouseInteraction pixelFilter={700} color1={P.blue} color2={P.navy} color3={P.ink} /> },
  { name: "PrismaticBurst", group: "Фоны", hint: "титул, финал", demo: C => <C animationType="rotate3d" intensity={2} speed={0.5} distort={1} paused={false} offset={{ x: 0, y: 0 }} hoverDampness={0.25} rayCount={24} mixBlendMode="lighten" colors={[P.blue, P.sky, P.ice]} /> },
  { name: "MagicRings", group: "Фоны", hint: "финал", demo: C => <C color={P.blue} colorTwo={P.sky} /> },
  { name: "GradientBlinds", group: "Фоны", hint: "разделы", demo: C => <C gradientColors={[P.navy, P.sky]} angle={0} noise={0.3} blindCount={12} blindMinWidth={50} spotlightRadius={0.5} spotlightSoftness={1} spotlightOpacity={1} mouseDampening={0.15} distortAmount={0} shineDirection="left" mixBlendMode="lighten" /> },
  { name: "MoltenMetal", group: "Фоны", hint: "титул (ярко)", demo: C => <C colorMode="frost" /> },
  { name: "Ferrofluid", group: "Фоны", hint: "титул (ярко)", demo: C => <C colors={[P.navy, P.blue, P.sky]} /> },
  { name: "Antigravity", group: "Фоны", hint: "финал", demo: C => <C color={P.sky} /> },
  { name: "Ballpit", group: "Фоны", hint: "игровой акцент", demo: C => <C count={120} gravity={0.7} friction={0.8} wallBounce={0.95} followCursor colors={[0x2f63f5, 0x6ccbff, 0xddebff]} /> },
  { name: "MetaBalls", group: "Фоны", hint: "слайд «правило ноль»", demo: C => <C color={P.sky} cursorBallColor={P.ice} cursorBallSize={2} ballCount={15} animationSize={30} enableMouseInteraction enableTransparency hoverSmoothness={0.05} clumpFactor={1} speed={0.3} /> },
  { name: "LineWaves", group: "Фоны", hint: "тихие слайды", demo: C => <C color1={P.navy} color2={P.blue} color3={P.sky} /> },
  { name: "GradientWaves", group: "Фоны", hint: "разделы", demo: C => <C horizonColor={P.sky} waveColor={P.blue} crestColor={P.ice} backgroundColor={P.ink} /> },
  { name: "ShapeWaves", group: "Фоны", hint: "разделы", demo: C => <C text="ИИ" color={P.blue} hoverColor={P.sky} backgroundColor={P.ink} /> },
  { name: "PatternWaves", group: "Фоны", hint: "тихие слайды" },
  { name: "DotField", group: "Фоны", hint: "настройки", demo: C => <C gradientFrom={P.navy} gradientTo={P.sky} glowColor={P.sky} /> },
  { name: "DriftWall", group: "Фоны", hint: "тихие слайды" },
  { name: "CursorGrid", group: "Фоны", hint: "настройки", demo: C => <C color={P.sky} gridColor="rgba(108,203,255,.15)" /> },
  { name: "WebThreads", group: "Фоны", hint: "слайд про агента", demo: C => <C colors={[P.navy, P.blue, P.sky]} coreColor={P.ice} backgroundColor={P.ink} /> },
  { name: "Noise", group: "Фоны", hint: "зерно поверх любого", demo: C => <C patternSize={250} patternScaleX={1} patternScaleY={1} patternRefreshInterval={2} patternAlpha={18} /> },
  { name: "AcidSquares", group: "Фоны", hint: "акцентный слайд", demo: C => <C color={P.navy} accentColor={P.sky} secondaryColor={P.blue} /> },

  /* ---------- Карточки и рамки ---------- */
  { name: "SpotlightCard", group: "Карточки и рамки", hint: "семь настроек, пять способов", box: "center", demo: C => <C className="custom-spotlight-card" spotlightColor="rgba(108,203,255,.25)">{cardBody}</C> },
  { name: "ElectricBorder", group: "Карточки и рамки", hint: "акцентная карточка", box: "center", demo: C => <C color={P.sky} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: 16 }}>{cardBody}</C> },
  { name: "StarBorder", group: "Карточки и рамки", hint: "кнопка, плашка", box: "center", demo: C => <C as="button" className="custom-class" color={P.sky} speed="5s"><span className="text-[22px] px-[20px]">Открыть настройки</span></C> },
  { name: "BorderGlow", group: "Карточки и рамки", hint: "карточки", box: "center", demo: C => <C>{cardBody}</C> },
  { name: "MagicBento", group: "Карточки и рамки", hint: "пять способов (сетка)", box: "center", demo: C => <C textAutoHide enableStars enableSpotlight enableBorderGlow enableTilt={false} enableMagnetism={false} clickEffect spotlightRadius={300} particleCount={12} glowColor="108, 203, 255" /> },
  { name: "GlassSurface", group: "Карточки и рамки", hint: "стеклянные плашки", box: "center", demo: C => <C width={520} height={220} borderRadius={24}>{cardBody}</C> },
  { name: "HoloCard", group: "Карточки и рамки", hint: "акцентная карточка", box: "center", demo: C => <C image={sculpture} foilColor={P.sky} width={420} /> },
  { name: "PixelCard", group: "Карточки и рамки", hint: "карточки", box: "center", demo: C => <C variant="blue"><div className="absolute inset-0 grid place-items-center">{cardBody}</div></C> },
  { name: "TiltedCard", group: "Карточки и рамки", hint: "скриншоты настроек", box: "center", demo: C => <C imageSrc={sculpture} altText="Скульптура" captionText="Скриншот настройки" containerHeight={520} containerWidth={520} imageHeight={520} imageWidth={520} rotateAmplitude={12} scaleOnHover={1.08} showTooltip displayOverlayContent overlayContent={<p className="m-0 mt-[20px] ml-[20px] px-[14px] py-[6px] rounded-[10px] bg-black/60 text-white text-[18px]">Настройка 3</p>} /> },
  { name: "ChromaGrid", group: "Карточки и рамки", hint: "пять способов (сетка)", box: "center", demo: C => <C items={[{ image: "", title: "Письмо", subtitle: "арендатору", handle: "способ 1", borderColor: P.blue, gradient: `linear-gradient(145deg, ${P.blue}, #000)` }, { image: "", title: "Разбор КП", subtitle: "одно слово", handle: "способ 2", borderColor: P.sky, gradient: `linear-gradient(145deg, ${P.sky}, #000)` }, { image: "", title: "Проверка", subtitle: "норма, контрагент", handle: "способ 3", borderColor: P.ice, gradient: `linear-gradient(145deg, ${P.navy}, #000)` }]} radius={300} damping={0.45} fadeOut={0.6} ease="power3.out" /> },
  { name: "GlareHover", group: "Карточки и рамки", hint: "карточки", box: "center", demo: C => <C glareColor="#ffffff" glareOpacity={0.3} glareAngle={-30} glareSize={300} transitionDuration={800} playOnce={false}><div className="glass rounded-[20px]">{cardBody}</div></C> },
  { name: "ReflectiveCard", group: "Карточки и рамки", hint: "акцентная карточка", box: "center", demo: C => <C tint={P.blue}>{cardBody}</C> },
  { name: "CrystalizedBall", group: "Карточки и рамки", hint: "декор", box: "center", demo: C => <C color={P.sky} /> },

  /* ---------- Текст ---------- */
  { name: "SplitText", group: "Текст", hint: "заголовки", box: "center", demo: C => <C text="Семь настроек" className="text-[96px] font-medium tracking-[-.045em] text-white" delay={60} duration={0.8} ease="power3.out" splitType="chars" from={{ opacity: 0, y: 40 }} to={{ opacity: 1, y: 0 }} threshold={0.1} rootMargin="-100px" textAlign="center" /> },
  { name: "BlurText", group: "Текст", hint: "заголовки, подзаголовки", box: "center", demo: C => <C text="ИИ как новый сотрудник" delay={120} animateBy="words" direction="top" className="text-[88px] font-medium tracking-[-.045em] text-white" /> },
  { name: "DecryptedText", group: "Текст", hint: "слайд про агента", box: "center", demo: C => <C text="Агент читает правила, потом задачу" animateOn="view" revealDirection="start" sequential speed={60} className="text-[64px] text-white" encryptedClassName="text-[64px] text-sky" parentClassName="font-mono" /> },
  { name: "ShinyText", group: "Текст", hint: "кикер над заголовком", box: "center", demo: C => <C text="Корпоративное обучение · три встречи" disabled={false} speed={3} className="text-[40px] tracking-[.1em] uppercase" /> },
  { name: "GradientText", group: "Текст", hint: "акцентное слово", box: "center", demo: C => <C colors={[P.blue, P.sky, P.ice, P.sky, P.blue]} animationSpeed={6} showBorder={false} className="text-[96px] font-medium tracking-[-.045em]">свой агент</C> },
  { name: "TextPressure", group: "Текст", hint: "титул (вариант)", box: "full", demo: C => <div className="absolute inset-0"><C text="Сотрудник" flex alpha={false} stroke={false} width weight italic={false} textColor={P.white} strokeColor={P.sky} minFontSize={120} /></div> },
  { name: "ScrambledText", group: "Текст", hint: "подзаголовки", box: "center", demo: C => <C className="text-[36px] max-w-[900px] text-fog leading-[1.4]" radius={100} duration={1.2} speed={0.5} scrambleChars=".:">Завтра к вам выходит умный стажёр. Он читал весь интернет, но не знает про вас ничего.</C> },
  { name: "TrueFocus", group: "Текст", hint: "ключевые слова", box: "center", demo: C => <C sentence="Чат Проект Агент" manualMode={false} blurAmount={5} borderColor={P.sky} animationDuration={0.6} pauseBetweenAnimations={1} /> },
  { name: "VariableProximity", group: "Текст", hint: "заголовок с реакцией на курсор", box: "center", demo: C => <div className="text-[80px] text-white" style={{ fontFamily: "Onest" }}><C label="Наведите на заголовок" fromFontVariationSettings="'wght' 200" toFontVariationSettings="'wght' 700" radius={140} falloff="linear" /></div> },
  { name: "DepthText", group: "Текст", hint: "титул (вариант)", box: "center", demo: C => <C text="Агент" faceColor={P.white} depthColor={P.blue} /> },
  { name: "StrokeText", group: "Текст", hint: "номера частей", box: "center", demo: C => <C text="01" strokeColor={P.sky} fillColor="transparent" /> },
  { name: "TechText", group: "Текст", hint: "слайд про агента", box: "center", demo: C => <C text="Агент" fontFamily="Onest" fontWeight={500} fontSize={140} color={P.white} accentColor={P.sky} /> },
  { name: "MaskedHeading", group: "Текст", hint: "заголовки разделов", box: "center", demo: C => <C text="Семь настроек" tint={P.blue} /> },
  { name: "WarpText", group: "Текст", hint: "акцент", box: "center", demo: C => <C text="Агент" color={P.white} /> },
  { name: "ParticleText", group: "Текст", hint: "титул (вариант)", box: "full", demo: C => <C text="Агент" color={P.white} highlightColor={P.sky} /> },
  { name: "Shuffle", group: "Текст", hint: "заголовки", box: "center", demo: C => <C text="Пять способов" className="text-[96px] font-medium tracking-[-.045em] text-white" shuffleDirection="right" duration={0.35} animationMode="evenodd" shuffleTimes={1} ease="power3.out" stagger={0.03} threshold={0.1} triggerOnce triggerOnHover respectReducedMotion /> },
  { name: "GlitchText", group: "Текст", hint: "акцент", box: "center", demo: C => <C speed={1} enableShadows enableOnHover={false} className="text-[120px]">Агент</C> },
  { name: "FuzzyText", group: "Текст", hint: "акцент", box: "center", demo: C => <C baseIntensity={0.2} hoverIntensity={0.5} enableHover fontSize={140} color={P.white}>Агент</C> },
  { name: "LetterGlitch", group: "Текст", hint: "фон для слайда про агента", box: "full", demo: C => <C glitchColors={["#0d1c44", "#2f63f5", "#6ccbff"]} glitchSpeed={50} centerVignette outerVignette={false} smooth /> },
  { name: "TextType", group: "Текст", hint: "набор промпта", box: "center", demo: C => <C text={["Разбери это КП: что не указано?", "Какая точка просела и на сколько?", "Напиши арендатору на английском"]} typingSpeed={55} pauseDuration={1500} showCursor cursorCharacter="|" className="text-[56px] text-white" /> },
  { name: "CircularText", group: "Текст", hint: "декор", box: "center", demo: C => <C text="ЧАТ · ПРОЕКТ · АГЕНТ · ВАШ · " onHover="speedUp" spinDuration={20} className="custom-class" /> },
  { name: "FoldText", group: "Текст", hint: "заголовки", box: "center", demo: C => <C text="Пять способов" color={P.white} /> },
  { name: "EchoText", group: "Текст", hint: "акцент", box: "center", demo: C => <C text="Агент" color={P.white} echoColors={[P.blue, P.sky]} /> },
  { name: "SplitFlapText", group: "Текст", hint: "табло времени демо (17:05 → 17:40)", box: "center", demo: C => <div className="text-[64px]"><C words={["17:05 СТАРТ", "17:40 РЕЗУЛЬТАТ"]} /></div> },

  /* ---------- Микро ---------- */
  { name: "CountUp", group: "Микро", hint: "цифры опросника", box: "center", demo: C => <div className="text-[160px] font-medium text-white tracking-[-.04em]"><C from={0} to={23} separator=" " direction="up" duration={1.5} className="count-up-text" /></div> },
  { name: "Counter", group: "Микро", hint: "цифры опросника", box: "center", demo: C => <C value={23} places={[10, 1]} fontSize={140} padding={5} gap={10} textColor={P.white} fontWeight={500} /> },
  { name: "Stepper", group: "Микро", hint: "карта ступеней", box: "center", demo: C => <C initialStep={1} nextButtonText="Дальше" backButtonText="Назад" completeButtonText="Готово" accentColor={P.blue} width={720}>{["Чат: вопросы без страха", "Проект: инструкция и файлы", "Агент: готовый, только включить", "Ваш агент: под вашу задачу"].map((t, i) => <StepperStep key={i} title={`Ступень ${i + 1}`} description={t}><p className="m-0 py-[20px] text-[22px] text-white">{t}</p></StepperStep>)}</C> },
  { name: "Dock", group: "Микро", hint: "панель инструментов на слайде", box: "center", demo: C => <C items={[{ icon: <span>💬</span>, label: "Чат", onClick: () => {} }, { icon: <span>📁</span>, label: "Проект", onClick: () => {} }, { icon: <span>🤖</span>, label: "Агент", onClick: () => {} }, { icon: <span>⭐</span>, label: "Ваш", onClick: () => {} }]} panelHeight={68} baseItemSize={50} magnification={70} /> },
  { name: "Cubes", group: "Микро", hint: "кубы (альтернатива three.js)", box: "center", demo: C => <C gridSize={8} maxAngle={60} radius={4} borderStyle="2px dashed #2f63f5" faceColor="#0a0f17" rippleColor={P.sky} rippleSpeed={1.5} autoAnimate rippleOnClick /> },
  { name: "Magnet", group: "Микро", hint: "кнопки", box: "center", demo: C => <C padding={100} disabled={false} magnetStrength={3}><button className="glass-hi rounded-[14px] px-[28px] py-[16px] text-[24px] text-white">Запустить агента</button></C> },
  { name: "ClickSpark", group: "Микро", hint: "клики на живых макетах", box: "center", demo: C => <div className="w-[520px] h-[260px]"><C sparkColor={P.sky} sparkSize={12} sparkRadius={24} sparkCount={8} duration={400}><div className="absolute inset-0 grid place-items-center"><div className="glass rounded-[20px] px-[40px] py-[30px] text-[28px] text-white">Кликните сюда</div></div></C></div> },
  { name: "Stack", group: "Микро", hint: "скриншоты настроек стопкой", box: "center" },
  { name: "CardSwap", group: "Микро", hint: "карточки способов", box: "center" },
  { name: "AnimatedList", group: "Микро", hint: "список задач из опросника", box: "center", demo: C => <C items={["Письма арендаторам", "Разбор КП", "Отчёт по точкам", "Проверка контрагента", "Сценарий для зала", "Выписка из договора"]} onItemSelect={() => {}} showGradients enableArrowNavigation displayScrollbar={false} /> },
  { name: "LogoLoop", group: "Микро", hint: "лента инструментов", box: "center", demo: C => <div className="w-[1000px]"><C logos={[{ node: <span className="text-[28px] text-white">ChatGPT</span> }, { node: <span className="text-[28px] text-white">Claude</span> }, { node: <span className="text-[28px] text-white">Codex</span> }, { node: <span className="text-[28px] text-white">Gemini</span> }, { node: <span className="text-[28px] text-white">GitHub</span> }]} speed={80} direction="left" logoHeight={40} gap={80} pauseOnHover fadeOut fadeOutColor={P.ink} /></div> },
  { name: "GradualBlur", group: "Микро", hint: "размытие края списка", box: "full" },
  { name: "ElectricLogo", group: "Микро", hint: "декор", box: "center", demo: C => <C color={P.sky} glowColor={P.blue} /> },
];

export const groups: Group[] = ["Фоны", "Карточки и рамки", "Текст", "Микро"];
