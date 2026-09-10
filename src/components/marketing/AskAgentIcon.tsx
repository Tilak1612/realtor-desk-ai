import { cn } from "@/lib/utils";

/**
 * The Ask Agent mark: a speech bubble whose top rises into the Realtor Desk
 * roofline, with a terracotta sparkle inside.
 *
 * WHY THIS SHAPE. Three signals, each for a reason:
 *   - Conversation: a bubble with a tail. The most widely understood cue for
 *     "chat with us".
 *   - AI: the sparkle. Google's research on the sparkle icon found it reliably
 *     signals "AI is here" and reads more clearly COMBINED with another symbol
 *     than on its own.
 *   - Brand: the roof peak and terracotta accent are lifted from RDMark, so
 *     this is recognisably ours rather than one more generic AI bubble.
 *
 * NN/g found that no participant read sparkles alone as "AI" and recommends
 * always pairing them with a label -- which is why the launcher keeps its
 * visible "Ask Agent" text and this icon stays decorative (aria-hidden).
 *
 * WHERE IT CAME FROM. Generated in Higgsfield with Recraft V4.1 in vector mode
 * (job 32300da1-2d04-4be8-b29e-3aba1a3e1d0a), picked from eight candidates
 * after checking each at 24, 32 and 56px inside the real launcher. Cleaned by
 * hand: the full-canvas background removed, three anti-aliasing slivers around
 * the sparkle removed (they rendered as a pink halo), coordinates rounded, and
 * the viewBox cropped to the artwork's measured alpha bounds -- as delivered it
 * filled under half its 2048 canvas and would have rendered tiny.
 *
 * THEMING. The body is currentColor, so it follows the text colour of whatever
 * contains it: paper on the navy launcher, navy on a light surface. The sparkle
 * is terra-600, which clears WCAG 1.4.11's 3:1 on navy at 4.70:1.
 */
export function AskAgentIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="450 454 1143 1143"
      className={cn("block", className)}
      aria-hidden="true"
      focusable="false"
      data-icon="ask-agent"
    >
      <path
        fill="currentColor"
        d="M 1037.1 496.3 C 1039.2 496.1 1041.3 496 1043.4 496 C 1054 495.8 1067.6 499 1075.8 505.5 C 1090.6 517.1 1105.5 530.9 1119.8 543.3 L 1213.6 624.7 L 1351.8 744.7 C 1370 760.6 1396.2 781.5 1412.8 797.8 C 1439.4 823.9 1458.2 857 1467 893.2 C 1473.8 922.1 1472.4 946.7 1472.4 975.9 L 1472.3 1048.1 L 1472.5 1294.4 C 1472.6 1352.4 1456.1 1402.7 1414.3 1444.4 C 1386.5 1472.1 1351.6 1491.6 1313.4 1500.6 C 1284.1 1507.5 1260.7 1506.3 1231.2 1506.3 L 1166.3 1506.3 L 947.8 1506.2 L 825.8 1506.3 C 808 1506.2 781.3 1505.3 764.6 1507.3 C 758.3 1508 730.4 1517.5 722.9 1519.9 L 647.6 1544.4 C 637.5 1547.7 619.8 1554 609.9 1554.8 C 603.6 1555.3 597.2 1554.2 591.4 1551.7 C 582.5 1547.9 575.6 1540.7 572.1 1531.6 C 570 1525.8 569.4 1519.4 570.5 1513.2 C 572.2 1504.2 587.2 1467.9 591.3 1458 C 602.8 1429.9 613.6 1399.7 625.7 1372.2 C 611.4 1326.9 613.9 1297.7 613.9 1251.4 L 614 1122.6 L 613.8 993.4 C 613.8 968 612.6 932.1 616.3 908.2 C 620.9 878.4 632.5 850.1 650.2 825.6 C 671.2 796.2 720 758.4 749.3 733.1 L 896.4 605.9 L 968.6 543.2 C 987.6 526.6 1012 500.5 1037.1 496.3 z"
      />
      <path
        fill="var(--rd-terra-600, #D7714E)"
        d="M 1220 774.3 L 1220.3 775.1 C 1224.2 787.7 1226.2 800.6 1230.6 813.6 C 1252.1 877.1 1309.1 922.4 1373.9 936 C 1378.4 936.9 1386 938.5 1390.2 938.2 L 1387.3 941.2 C 1303 946.3 1226.1 1019.8 1220.8 1104.8 L 1219.2 1104.8 C 1216 1076.3 1202.3 1041.2 1185.5 1018 C 1151.1 970.9 1105.6 949 1049.5 939.9 C 1076.9 934.5 1096.3 929.8 1121.3 916.9 C 1178.4 887.5 1209.6 836.7 1219.4 774.7 L 1220 774.3 z"
      />
    </svg>
  );
}

export default AskAgentIcon;
