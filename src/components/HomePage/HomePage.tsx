"use client"
import { ReactLenis } from '@studio-freight/react-lenis'
import { motion } from 'framer-motion'
import { Icon } from '@mdi/react'
import { mdiMagnify, mdiMenu, mdiClose, mdiEmail, mdiMapMarker, mdiGoogle } from '@mdi/js'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Footer from '../Common/Footer'
import { usePathname } from 'next/navigation'

export const HomePage = () => {
    const pathname = usePathname();

    return (
        <ReactLenis root>
            <main className="min-h-screen bg-[#FDFDFD]">
                <header>
                    <div className="max-width-full-hd mx-auto header relative">
                        <video autoPlay muted loop className="video-background">
                            <source src="https://cdn.widodc.com/video/bgr-home.mp4" />
                        </video>
                        <div className="head absolute top-0 left-0 flex items-center h-full w-full px-6 sm:px-16 xl:px-36">
                            <div className="absolute top-0 left-0 w-full">
                                <menu className="pl-6 md:pl-16 lg:pl-36">
                                    <div className="menu-min z-50 md:hidden">
                                        <div className="min-menu-close z-40 fixed top-0 left-0 w-full h-full hidden"></div>
                                        <motion.div
                                            className="min-menu-nav z-50 bg-white fixed top-0 py-10 right-0 h-full tranf w-0"
                                            initial={{ width: 0 }}
                                            animate={{ width: "0" }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <nav className="px-5">
                                                <div className="flex justify-end">
                                                    <Icon path={mdiClose} size={1} className="text-xl cursor-pointer" />
                                                </div>
                                                <Link href="/" className='w-[101px] h-[68px] relative'>
                                                    <Image
                                                        alt="logo"
                                                        src="/images/Logo_wido.png"
                                                        width={200}
                                                        height={200}
                                                        className="w-full h-full object-contain"
                                                        quality={100}
                                                        draggable={false}
                                                    />
                                                </Link>
                                                <Link href="/" className={`px-1 mx-2 font-semibold py-0 text-lg whitespace-nowrap cursor-pointer hover:underline ${pathname === '/' ? 'text-[#F2A024]' : ''}`}>
                                                    <p>Trang chủ</p>
                                                </Link>
                                                <Link href="/#products" className={`px-1 mx-2 font-semibold py-0 text-lg whitespace-nowrap cursor-pointer hover:underline ${pathname.startsWith('/#products') ? 'text-[#F2A024]' : ''}`}>
                                                    <p>Sản phẩm</p>
                                                </Link>
                                                <Link href="/#about-us" className={`px-1 mx-2 font-semibold py-0 text-lg whitespace-nowrap cursor-pointer hover:underline ${pathname.startsWith('/#about-us') ? 'text-[#F2A024]' : ''}`}>
                                                    <p>Về chúng tôi</p>
                                                </Link>
                                                <Link href="/career" className={`px-1 mx-2 font-semibold py-0 text-lg whitespace-nowrap cursor-pointer hover:underline ${pathname === '/career' ? 'text-[#F2A024]' : ''}`}>
                                                    <p>Tuyển dụng</p>
                                                </Link>
                                                <Link href="/auth" className="flex mt-5 items-center hover:bg-stone-200 cursor-pointer border rounded-xl px-5 py-2 w-fit">
                                                    <div className="flex mt-5 items-center hover:bg-stone-200 cursor-pointer border rounded-xl px-5 py-2 w-fit">
                                                        <Icon path={mdiGoogle} size={0.8} className="text-xl" />
                                                        Đăng nhập
                                                    </div>
                                                </Link>
                                            </nav>
                                        </motion.div>
                                    </div>
                                    <div className="flex justify-between md:hidden items-center">
                                        <div className="flex justify-end w-full">
                                            <div className="pl-36 pr-6 py-5">
                                                <Icon path={mdiMenu} size={1} className="text-3xl font-extrabold text-white" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="justify-between items-center hidden md:flex">
                                        <div className="flex">
                                            <Link href="/" className='w-[101px] h-[68px] relative'>
                                                <Image
                                                    alt="logo"
                                                    src="/images/Logo_wido.png"
                                                    width={200}
                                                    height={200}
                                                    className="w-full h-full object-contain"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                        <div className="py-5 sm:py-12 lg:py-14 flex justify-end items-center pr-6 sm:pr-16 lg:pr-36 pl-10 text-white">
                                            <Link href="/" className={`px-1 mx-2 text-lg whitespace-nowrap cursor-pointer hover:underline ${pathname === '/' ? 'text-[#F2A024]' : ''}`}>
                                                Trang chủ
                                            </Link>
                                            <Link href="/#products" className={`px-1 mx-2 text-lg whitespace-nowrap cursor-pointer hover:underline ${pathname.startsWith('/#products') ? 'text-[#F2A024]' : ''} menu-activate`}>
                                                Sản phẩm
                                            </Link>
                                            <Link href="/#about-us" className={`px-1 mx-2 text-lg whitespace-nowrap cursor-pointer hover:underline ${pathname.startsWith('/#about-us') ? 'text-[#F2A024]' : ''}`}>
                                                Về chúng tôi
                                            </Link>
                                            <Link href="/career" className={`px-1 mx-2 text-lg whitespace-nowrap cursor-pointer hover:underline ${pathname === '/career' ? 'text-[#F2A024]' : ''}`}>
                                                Tuyển dụng
                                            </Link>
                                            <Link href="/auth" >
                                                <Button variant="outline" className="flex items-center hover:underline cursor-pointer border rounded-xl px-2 py-1 ml-2 text-white !bg-transparent hover:text-white/80">
                                                    <Icon path={mdiGoogle} size={0.8} className="text-xl" />
                                                    Đăng nhập
                                                </Button></Link>
                                        </div>
                                    </div>
                                </menu>
                            </div>
                            <div className="w-1/2 sm:w-1/3">
                                <Image
                                    alt="logo"
                                    src="/images/Logo_wido.png"
                                    width={101}
                                    height={68}
                                    className="sm:hidden w-20"
                                    quality={100}
                                    draggable={false}
                                />
                                <div className="hidden sm:block">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="name font-bold text-5xl xl:text-7xl name-shadow mb-3 text-primary"
                                    >
                                        WIDO<span className="text-[#F2A024]">FILE</span>
                                    </motion.h1>
                                    <motion.i
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                        className="slogan text-sm xl:text-base mt-1"
                                    >
                                        Ứng dụng quản lý tài liệu thiết kế game và quản lý dự án của chúng tôi.
                                    </motion.i>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <section className="max-width mx-auto mb-24">
                    <div className="mx-4 sm:mx-16 lg:mx-64 mt-6 sm:mt-14 lg:mt-16">
                        <video autoPlay muted loop controls className="rounded-lg w-full">
                            <source src="https://cdn.widodc.com/video/trailer.mp4" />
                        </video>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mt-6 sm:mt-24 lg:mt-32 mx-7 sm:mx-16 xl:mx-36 flex justify-start items-center flex-wrap"
                    >
                        <div className="w-full sm:w-1/2 px-3 mb-10">
                            <div className="mb-4 sm:mb-6">
                                <h1 className="text-xs font-bold sm:text-lg lg:text-2xl mb-2 sm:mb-5 text-black">
                                    <Image
                                        quality={100}
                                        draggable={false}
                                        alt="&quot;"
                                        src="/images/comma.png"
                                        width={35}
                                        height={27}
                                        className="w-4 sm:w-7 lg:w-9 inline mr-1"
                                        style={{ transform: "translateY(-6px)" }}
                                    /> <span>Game studio</span>
                                </h1>
                                <h2 className="text-2xl font-extrabold sm:text-4xl lg:text-5xl text-black">Khởi nguồn của những trò chơi giải trí</h2>
                            </div>
                            <p className="text-sm sm:text-base lg:text-lg sm:mb-12 lg:mb-16">
                                Chúng tôi tạo ra những trò chơi di động tuyệt vời cho người dùng toàn cầu ở nhiều thể loại khác nhau: Hypercasual, Casual, Puzzle, Action, Adventure,... Hãy để chúng tôi phục vụ thời gian của bạn với trò chơi của chúng tôi.
                            </p>
                            <Link href="https://play.google.com/store/apps/dev?id=8799588644277179294" target="_blank" className="hidden sm:block">
                                <Button className="px-3 sm:px-4 lg:px-5 py-1 sm:py-2 lg:py-3 text-white rounded-md text-xs sm:text-sm lg:text-base font-bold sm:rounded-lg bg-[#2C8B3D] hover:bg-[#88C140] h-12">
                                    Xem các trò chơi của chúng tôi
                                </Button>
                            </Link>
                        </div>
                        <div className="w-full sm:w-1/2 px-3">
                            <Image
                                quality={100}
                                draggable={false}
                                alt="colorball huawei achievement"
                                src="/images/home-image1.png"
                                width={1024}
                                height={500}
                                className="w-full"
                            />
                            <div className="sm:hidden block">
                                <Link href="https://play.google.com/store/apps/dev?id=8799588644277179294" target="_blank">
                                    <Button className="px-3 sm:px-4 lg:px-5 py-1 sm:py-2 lg:py-3 text-white rounded-md text-xs sm:text-sm lg:text-base font-bold mt-5 mb-10 mx-auto block bg-[#2C8B3D] hover:bg-[#88C140] h-12">
                                        Xem các trò chơi của chúng tôi
                                    </Button>
                                </Link>
                                <div className="w-24 rounded-lg border-b-2 mx-auto block mb-5 border-[#F2A024]"></div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mt-6 sm:mt-24 lg:mt-32 mx-7 sm:mx-16 xl:mx-36 flex justify-start items-center flex-wrap-reverse"
                    >
                        <div className="w-full sm:w-1/2 px-3">
                            <Image
                                quality={100}
                                draggable={false}
                                alt="img"
                                src="/images/home-image2.png"
                                width={1024}
                                height={581}
                                className="w-full transform__11"
                            />
                            <div className="sm:hidden block">
                                <div className="w-24 rounded-lg border-b-2 mx-auto block mb-5 border-[#F2A024] mt-7"></div>
                            </div>
                        </div>
                        <div className="w-full sm:w-1/2 px-3 mb-10">
                            <div className="mb-4 sm:mb-6 sm:text-right">
                                <h1 className="text-xs font-bold sm:text-lg lg:text-2xl mb-2 sm:mb-5 text-black">
                                    <Image
                                        quality={100}
                                        draggable={false}
                                        alt="&quot;"
                                        src="/images/comma.png"
                                        width={35}
                                        height={27}
                                        className="w-4 sm:w-7 lg:w-9 inline mr-1"
                                        style={{ transform: "translateY(-6px)" }}
                                    /> <span>Game publishing</span>
                                </h1>
                                <h2 className="text-2xl font-extrabold sm:text-4xl lg:text-5xl text-black">Khám phá tiềm năng của trò chơi của bạn</h2>
                            </div>
                            <p className="text-sm sm:text-base lg:text-lg sm:mb-12 lg:mb-16 sm:text-right">
                                Kinh nghiệm thực tế trong phát triển và xuất bản, <br /> Hỗ trợ toàn diện, ...
                            </p>
                            <div className="hidden sm:flex justify-end">
                                <Link href="https://play.google.com/store/apps/dev?id=8799588644277179294" target="_blank">
                                    <Button className="px-3 sm:px-4 lg:px-5 py-1 sm:py-2 lg:py-3 text-white rounded-md text-xs sm:text-sm lg:text-base font-bold sm:rounded-lg bg-[#2C8B3D] hover:bg-[#88C140] h-12">
                                        Xem các trò chơi của chúng tôi
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        id="products"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mt-6 sm:mt-24 lg:mt-32 mx-7 sm:mx-16 xl:mx-36"
                    >
                        <h1 className="font-extrabold text-2xl sm:text-4xl text-center mb-6 sm:mb-12 lg:mb-16" style={{ color: "#6A6A6A" }}>Sản phẩm</h1>
                        <div className="flex justify-start items-start flex-wrap">
                            {/* Product 1 */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_09/Pixel_by_Number_-_Pixel_Art_AND-1725999095.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Pixel by Number™ - Pixel Art</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.color.number.sanbox.pixel.art" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                            <Link href="https://apps.apple.com/us/app/pixel-by-number-pixel-art/id1604351484" target="_blank">
                                                <Image
                                                    alt="app store"
                                                    src="/images/appstore-logo.png"
                                                    width={26}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 2 */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_05/Snow_Race_3D:_Fun_Racing-1716235853.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Snow Race 3D: Fun Racing</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.ice.ball.snow.race" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                            <Link href="https://apps.apple.com/us/app/xmas-snow-race-3d-racing/id6450210808" target="_blank">
                                                <Image
                                                    alt="app store"
                                                    src="/images/appstore-logo.png"
                                                    width={26}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 3 */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_09/Draw_2_Bridge_iOS-1726776718.jpg"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Draw 2 Bridge: Draw Save Car</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.draw.bridge.puzzle.drawgame" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                            <Link href="https://apps.apple.com/us/app/draw-2-bridge-puzzle-game/id6444823410" target="_blank">
                                                <Image
                                                    alt="app store"
                                                    src="/images/appstore-logo.png"
                                                    width={26}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 4 - Ẩn trên mobile */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 hidden sm:block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_08/Scan_the_Alien-1724184705.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Scan the Alien</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.cmd.alien3d" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 5 - Ẩn trên mobile */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 hidden sm:block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_08/Save_Stickman_Puzzle-1723234275.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Save The Stickman: Draw 2 Save</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.tenmob.drawstickmanpuzzle" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                            <Link href="https://apps.apple.com/us/app/save-the-stickman-draw-2-save/id1672776309" target="_blank">
                                                <Image
                                                    alt="app store"
                                                    src="/images/appstore-logo.png"
                                                    width={26}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 6 - Ẩn trên mobile */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 hidden sm:block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_06/Car_Park_3D_-_Puzzle_Master-1718050341.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Car Park 3D - Puzzle Master</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.car.match.park.master" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                            <Link href="https://apps.apple.com/us/app/car-park-3d-puzzle-master/id6553990638" target="_blank">
                                                <Image
                                                    alt="app store"
                                                    src="/images/appstore-logo.png"
                                                    width={26}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 7 - Ẩn trên mobile và tablet */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 hidden lg:block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_03/Max's_World-1711485094.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Max's world™</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.widogame.maxsworld" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                            <Link href="https://apps.apple.com/us/app/maxs-world/id6476092157" target="_blank">
                                                <Image
                                                    alt="app store"
                                                    src="/images/appstore-logo.png"
                                                    width={26}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 8 - Ẩn trên mobile và tablet */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 hidden lg:block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_07/Save_The_Dog:_Draw_Puzzle-1722024685.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Save The Dog: Draw Puzzle</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.save.the.dog.puzzle" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 9 - Ẩn trên mobile và tablet */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 hidden lg:block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_08/Take_It_Out:_Tricky_Game-1724789532.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Take It Out: Tricky Game</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.takeitout.helpme.trickystory" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                            <Link href="https://apps.apple.com/us/app/take-it-out-tricky-game/id6553990321" target="_blank">
                                                <Image
                                                    alt="app store"
                                                    src="/images/appstore-logo.png"
                                                    width={26}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 10 - Chỉ hiển thị trên desktop */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 hidden xl:block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_07/Pixel_By_Number_2-1721851929.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Pixel By Number 2</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.pixel.by.number.art.puzzle.az" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                            <Link href="https://apps.apple.com/us/app/pixel-by-number-2-pixel-art/id6636471876" target="_blank">
                                                <Image
                                                    alt="app store"
                                                    src="/images/appstore-logo.png"
                                                    width={26}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 11 - Chỉ hiển thị trên desktop */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 hidden xl:block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_04/Super_Flint_Go_-_Jungle_Bros_AND-1712693427.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Super Flint Go - Jungle Bros</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.wdg.flint.go.superrun.classic" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                            <Link href="https://apps.apple.com/us/app/super-flint-go-jungle-journey/id1616129914" target="_blank">
                                                <Image
                                                    alt="app store"
                                                    src="/images/appstore-logo.png"
                                                    width={26}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Product 12 - Chỉ hiển thị trên desktop */}
                            <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 px-3 py-2 hidden xl:block">
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ duration: 0.2 }}
                                    style={{ background: "#F0F0F0" }}
                                    className="flex justify-start items-start rounded-xl overflow-hidden"
                                >
                                    <Image
                                        className="rounded-xl"
                                        alt="icon"
                                        src="https://cdn.widodc.com/app/image/2024_07/Boba_DIY-1720037528.webp"
                                        width={92}
                                        height={92}
                                        quality={100}
                                        draggable={false}
                                    />
                                    <div className="overflow-hidden flex-1 pl-3 px-2 py-2 flex flex-col justify-between h-full">
                                        <h3 className="font-semibold truncate">Boba DIY</h3>
                                        <div className="flex justify-start items-center mt-5">
                                            <Link href="https://play.google.com/store/apps/details?id=com.boba.maker.drink.diy" target="_blank">
                                                <Image
                                                    alt="google play"
                                                    src="/images/ggplay-logo.png"
                                                    width={24}
                                                    height={27}
                                                    className="mx-4"
                                                    quality={100}
                                                    draggable={false}
                                                />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-7 sm:mt-16 lg:mt-20">
                            <Link href="https://play.google.com/store/apps/dev?id=8799588644277179294" target="_blank">
                                <Button className="px-3 sm:px-4 lg:px-5 py-1 sm:py-2 lg:py-3 text-white rounded-md text-xs sm:text-sm lg:text-base font-bold sm:rounded-lg bg-[#2C8B3D] hover:bg-[#88C140] h-12">
                                    Xem các trò chơi của chúng tôi
                                </Button>
                            </Link>
                        </div>
                        <div className="w-24 rounded-lg border-b-2 mx-auto block border-[#F2A024] mt-7 sm:hidden"></div>
                    </motion.div>

                    <motion.div
                        id="about-us"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="mt-6 sm:mt-24 lg:mt-32 mx-7 sm:mx-16 xl:mx-36"
                    >
                        <h1 className="font-extrabold text-2xl sm:text-4xl text-center mb-6 sm:mb-12 lg:mb-16" style={{ color: "#6A6A6A" }}>Về chúng tôi</h1>
                        <div className="flex justify-start items-center flex-wrap">
                            <div className="w-full sm:w-1/2 px-3 mb-10">
                                <div className="mb-4 sm:mb-6">
                                    <h1 className="text-xs font-bold sm:text-lg lg:text-2xl mb-2 sm:mb-5 text-black">
                                        <Image
                                            alt="&quot;"
                                            src="/images/comma.png"
                                            width={35}
                                            height={27}
                                            className="w-4 sm:w-7 lg:w-9 inline mr-1"
                                            style={{ transform: "translateY(-6px)" }}
                                        /> <span>Về đội ngũ</span>
                                    </h1>
                                    <h2 className="text-2xl font-extrabold sm:text-4xl lg:text-5xl text-black">Đội ngũ WidoFile và thành viên cốt lõi</h2>
                                </div>
                                <p className="text-sm sm:text-base lg:text-lg sm:mb-4 lg:mb-7">
                                    WidoFile là một đội ngũ đam mê chuyên về các trò chơi đố vui và câu đố hybrid. Chúng tôi tập trung vào việc mang đến những trải nghiệm chơi game hấp dẫn và sáng tạo thu hút người chơi. Với văn hóa trẻ trung, năng động, chúng tôi cam kết mở rộng giới hạn của trò chơi di động.
                                </p>
                                <Link href="/career" className="hidden sm:block">
                                    <Button className="px-3 sm:px-4 lg:px-5 py-1 sm:py-2 lg:py-3 text-white rounded-md text-xs sm:text-sm lg:text-base font-bold sm:rounded-lg bg-[#2C8B3D] hover:bg-[#88C140] h-12">
                                        Ứng tuyển
                                    </Button>
                                </Link>
                            </div>
                            <div className="w-full sm:w-1/2 px-3">
                                <Image
                                    alt="team"
                                    src="/images/home-image3.png"
                                    width={1024}
                                    height={722}
                                    className="w-full"
                                />
                                <div className="sm:hidden block">
                                    <Link href="/career">
                                        <Button className="px-3 sm:px-4 lg:px-5 py-1 sm:py-2 lg:py-3 text-white rounded-md text-xs sm:text-sm lg:text-base font-bold mt-5 mb-10 mx-auto block bg-[#2C8B3D] hover:bg-[#88C140] h-12">
                                            Ứng tuyển
                                        </Button>
                                    </Link>
                                    <div className="w-24 rounded-lg border-b-2 mx-auto block mb-5 border-[#F2A024]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <div style={{ transform: "translateX(-32px)" }} className="mt-12 flex justify-start">
                                <div className="w-1/2 flex justify-center">
                                    <Image
                                        alt="avatar"
                                        src="/images/avatar1.png"
                                        width={720}
                                        height={720}
                                        className="w-48 h-48 lg:w-64 lg:h-64"
                                        quality={100}
                                        draggable={false}
                                    />
                                </div>
                                <div className="w-1/2 flex justify-start items-center">
                                    <div className="block">
                                        <h1 className="text-2xl font-extrabold sm:text-4xl lg:text-5xl mb-2 sm:mb-5 text-black">
                                            <Image
                                                quality={100}
                                                alt="&quot;"
                                                src="/images/comma.png"
                                                width={35}
                                                height={27}
                                                className="w-4 sm:w-7 lg:w-9 inline mr-1"
                                                style={{ transform: "translateY(-6px)" }}
                                            /> <span>Peter Nguyen</span>
                                        </h1>
                                        <h2 className="text-xs sm:text-lg lg:text-2xl font-bold text-black">CEO</h2>
                                        <p className="text-sm sm:text-base lg:text-lg mt-3">
                                            With expertise having more than 5 years of experience in gaming industry, WidoGame confidently provides significant and thorough service packages for global game and app companies.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ transform: "translateX(32px)" }} className="mt-12 flex justify-start flex-row-reverse">
                                <div className="w-1/2 flex justify-center">
                                    <Image
                                        alt="avatar"
                                        src="/images/avatar2.png"
                                        width={720}
                                        height={720}
                                        className="w-48 h-48 lg:w-64 lg:h-64"
                                        quality={100}
                                        draggable={false}
                                    />
                                </div>
                                <div className="w-1/2 flex justify-start items-center">
                                    <div className="text-right block">
                                        <h1 className="text-2xl font-extrabold sm:text-4xl lg:text-5xl mb-2 sm:mb-5 text-black">
                                            <Image
                                                quality={100}
                                                alt="&quot;"
                                                src="/images/comma.png"
                                                width={35}
                                                height={27}
                                                className="w-4 sm:w-7 lg:w-9 inline mr-1"
                                                style={{ transform: "translateY(-6px)" }}
                                            /> <span>Lana Phung</span>
                                        </h1>
                                        <h2 className="text-xs sm:text-lg lg:text-2xl font-bold text-black">CMO</h2>
                                        <p className="text-sm sm:text-base lg:text-lg mt-3">
                                            To me, Widogame is a workplace that even my dog looks forward to coming to every day.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div style={{ transform: "translateX(-32px)" }} className="mt-12 flex justify-start">
                                <div className="w-1/2 flex justify-center">
                                    <Image
                                        alt="avatar"
                                        src="/images/avatar3.png"
                                        width={720}
                                        height={720}
                                        className="w-48 h-48 lg:w-64 lg:h-64"
                                        quality={100}
                                        draggable={false}
                                    />
                                </div>
                                <div className="w-1/2 flex justify-start items-center">
                                    <div className="block">
                                        <h1 className="text-2xl font-extrabold sm:text-4xl lg:text-5xl mb-2 sm:mb-5 text-black">
                                            <Image
                                                quality={100}
                                                alt="&quot;"
                                                src="/images/comma.png"
                                                width={35}
                                                height={27}
                                                className="w-4 sm:w-7 lg:w-9 inline mr-1"
                                                style={{ transform: "translateY(-6px)" }}
                                            /> <span>Daniel Nguyen</span>
                                        </h1>
                                        <h2 className="text-xs sm:text-lg lg:text-2xl font-bold text-black">CTO</h2>
                                        <p className="text-sm sm:text-base lg:text-lg mt-3">
                                            With expertise having more than 5 years of experience in gaming industry, WidoGame confidently provides significant and thorough service packages for global game and app companies.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>
                <Footer />
            </main>
        </ReactLenis>
    );
};

export default HomePage; 