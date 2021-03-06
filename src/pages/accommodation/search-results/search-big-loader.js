import React, { useState, useEffect } from "react";
import { Loader } from "components/simple";

const GRID_COLS = 178;
const GRID_ROWS = 88;
const INTERVAL_X = 7;
const INTERVAL_Y = 7;
const FPS = 10;
const SPEED = 4.8/FPS;
const PREFILL_SPEED = 3;
const COLORS = ["#fff", "#efefef", "#e0e0e0", "#f9a51a", "#bababa", "#f9a51a", "#FFA744"];
const BLICK = 0.0023/FPS;

const SearchBigLoader = ({ destination }) => {
    const [supported, setSupported] = useState(true);

    useEffect(() => {
        const map = "5823748043641906023552631412603216953522862428445785927440889381751116709953554304265731176494927336886229178159814884908777737305720026928017815840683782869993688886188395210395835241991977460872697518403792781405479199979107604953794152184009666340191432598315551588588556116764352114121820743956818379656553650170243091699637954389581242387458178056763086249830061719109833728582656162220064913679470344328548859008799360790057909653318229881689073328042433030120884113967037975133599471595158452101747942807038804650928665433074084036369787734690028376996784972143599217743224414854211663962740849486874233004859579153666937161155419248549581063457137777827489854443353686998201961981389580860037561409180997722608903480532059843380190170987362991234904097435615142761564493317191715429508518807219876566992108238259920810226574568595919510042525784753771684021832409695236836774557945405763793943212110753540086183550852600087540336900517826623554121107917104327545350302810158105113315081194429674971884316110967945225182028586905514601660266924565416874284916516832875996960118363140293951429254131809957536143640685388967060946378669726696926609661860032921054726981759256847202672086000999569398568658635756523603670684056585014653667546846832769887037202001236651269500386053635408251698838075886534427390453204354069994143695744908320198872267191451476569351834461949888427985760755135320658113494075566950965120049793672315579304719224467952883666859602192445555877967411852261276197488793972101027426440466107577169426767018775239997326089991377215568012664836118301748171526312572408558275212211032903570044400475618469277016349014030921456424325524894882991495387637176921953707754725388914933683524202380091789183797347941879746208108149598831794552418265817528358026533255746227712336339450586102701961081570495575012987610122457506345984196785001682980220996418332352037816968097166087884769815054484841193338807075299925600097969233571342538912247015627164601876431633959915252407475352113909767059576079499533917618865696285706387398458329276278845972395738087405930915483645881595812547419074921472676031106667592304041323999388393903262005308163403229984867560442232411441896817724255941336365843079708765679633665032456073525043523823342805745454604183835101588416413504743958942885343498361057540557726510767380480550589610045114250822845951872916209747169035169866908491162522206665943958120939615149619634134819072023359359331289755461235274291515863117410171529738385675933831343187417163842419208081404856622578594528282287411301270315655560821844333784599283353508832112581638021774582513504553701283777110213169447262938641783985308437046975164008888543608727214839743566368925141960286355156655221775744080526677139912804556976901908572398879334710270815580835658747198194334902483565715189539087156058636204906326461290269679253755417388967904122596834906892344367287283725955446149855964838254589071703291178400445904271129660807572117946530225791270371188985042454568063030637883259257506109913336621954995263580051472185131587189543873153296203161139147832297075011828661099483979006775558291231428221564125383905506158212788052356173253880285945194841136466169263281051150383256229366676217559840516781668809433061789441354762138141026844474352968274494268403180511183333357732355285611123516710176482973798137825322378789428532080172909007141521988790955257128069861559914398451971446464524126480314182389753326852445045924743779023944736051065284179279453541471700580140727235464441821463460965679369950469672826101872882973680465783488558033155718890296608834221388049571015078640112083930054433738183875658219109349562911920284818134189341549986525380390147331019899345657227980342918525128334392195520595077444405616535966720817723105154002288891995716327068421306982076070357572259631980551625291379977615928964933255231558236366794432590558713115348527513144811013744946557863002873218007911828977414250920094366829427378835400514530038392660695120303360238281823774149395906658865228265618583634567367610067753277691497982274267504353724415940242653949542616540878814622564718822590065108109996429478101760659929422177208260561211941785389680139051185486162224909854018912887892648573508413191090639811517578047126559430365423079640763597371412614562576949195349926207395968240280190547317006720062228810788183445955465817575104143429518279402627878356443713085919187603765347920108431040571526005416421438018658329078999106724337565570577072565870915140420656849845099225685623947362277796525250467786862208422786631058020091920809479552691732254246666490712797137462704560755715346615900220815821558668765832531348882902773820884761452469431281123328";
        let grid = [];
        let available = true;
        try {
            grid = (Array(65).fill("0").join('') + BigInt(map).toString(2)).split('').map(i=>parseInt(i));
        } catch {
            available = false;
        }
        setSupported(available);
        if (!available)
            return;

        let canvas, canvasContext, iteration = 2;

        const resolveColor = (value) => {
            if (value >= COLORS.length)
                return COLORS[COLORS.length - 1];
            return COLORS[value];
        };

        const resolveRadius = (value) => {
            if (value > 1000)
                return 4;
            return Math.min(1.8, (1 + (value/70))^2)
        };

        const areWePrefillIt = (i) => {
            return Math.random() < (PREFILL_SPEED / Math.abs(GRID_ROWS/2 - i));
        };

        const areWeFillIt = (i) => {
            return Math.random() < (SPEED / ( Math.sqrt(iteration/2) * Math.sqrt(5+Math.abs(GRID_ROWS/2 - i))));
        };

        const rowColToArrayIndex = (col, row) => col + GRID_COLS * row;

        const colorRect = (x, y, w, h, color) => {
            canvasContext.fillStyle = color;
            canvasContext.fillRect(x, y, w, h);
        };

        const colorCircle = (x, y, r, color) => {
            canvasContext.fillStyle = color;
            canvasContext.beginPath();
            canvasContext.arc(x+40, y+40, r, 0, 2 * Math.PI, true);
            canvasContext.fill();
        };

        const draw = () => {
            colorRect(0, 0, canvas.width, canvas.height, '#ffffff');
            iteration++;

            for (let i = 0; i < GRID_ROWS; i++)
                for (let j = 0; j < GRID_COLS; j++) {
                    const arrayIndex = rowColToArrayIndex(j, i),
                          value = grid[arrayIndex];

                    if (value >= 1) {
                        colorCircle(
                            INTERVAL_X * j,
                            INTERVAL_Y * i,
                            resolveRadius(value),
                            resolveColor(value)
                        );
                        if (value > 1000) {
                            if (Math.random() < 0.6/FPS)
                                grid[arrayIndex] = COLORS.length;
                        }
                        if (areWeFillIt(i)) {
                            grid[arrayIndex]++;
                            if (value >= COLORS.length && (Math.random() < (BLICK * (1+iteration/FPS/10))))
                                grid[arrayIndex] = 1001;
                        }
                    }
                }
        };

        for (let i = 0; i < GRID_ROWS; i++)
            for (let j = 0; j < GRID_COLS; j++) {
                const arrayIndex = rowColToArrayIndex(j, i);
                if ((grid[arrayIndex] >= 1) && areWePrefillIt(i))
                    grid[arrayIndex] = 10;
            }

        canvas = document.getElementById('loaderCanvas');
        if (!canvas)
            return;
        canvasContext = canvas.getContext('2d');

        draw();
        const interval = setInterval(draw, 1000/FPS);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="search-big-loader">
            { !supported ?
                <Loader /> :
                <>
                    <h1>Searching accommodations</h1>
                    <h2>{destination}</h2>
                    <p align="center">
                        <canvas id="loaderCanvas" width="1300" height="700" />
                    </p>
                </>
            }
        </div>
    );
};

export default SearchBigLoader;
