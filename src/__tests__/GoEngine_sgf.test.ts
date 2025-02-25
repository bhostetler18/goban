/**
 * @jest-environment jsdom
 */

// ^^ jsdom environment is because getLocation() returns window.location.pathname
// Same about CLIENT.
//
// TODO: move this into a setup-jest.ts file

(global as any).CLIENT = true;

import { TestGoban } from "../TestGoban";

type SGFTestcase = {
    template: string;
    moves: string;
    id: string;
};

const SGF_TEST_CASES: Array<SGFTestcase> = [
    {
        template:
            "(;GM[1]FF[4]CA[UTF-8]AP[CGoban:3]ST[2] RU[Japanese]SZ[19]KM[0.00]PW[White]PB[Black]_MOVES_)",
        moves: ";W[aa]C[příliš žluťoučký kůň úpěl ďábelské ódy];W[pd]",
        id: "unicode",
    },
    {
        template:
            "(;FF[4]GM[1]SZ[19]AP[]US[]EV[74th Honinbo challenger decision match]PC[]PB[Shibano Toramaru]BR[7d]PW[Kono Rin]WR[9d]KM[6.5]RE[W+1.5]DT[2019-04-10]TM[0]_MOVES_)",
        moves: ";B[pd];W[dp];B[pq];W[dc];B[ce];W[cg];B[cq];W[cp];B[dq];W[fq]",
        id: "honinbo game",
    },
];

function rmNewlines(txt: string): string {
    return txt.replace(/[\n\r]/g, "");
}
/*
 * check that parse -> serialize roundtrip generates the same sgf
 * (at least for the moves so far)
 */
test.each(SGF_TEST_CASES)(
    "sgf -> parseSGF() -> toSGF() roundtrip (moves only)",
    ({ template, moves, id }) => {
        const sgf = template.replace(/_MOVES_/, moves);
        const goban = new TestGoban({ original_sgf: sgf, removed: "" });
        // by default, `edited = true` when `original_sgf` is used, which causes
        // the moves to be serialized as setup SGF props `AB` & `AW`.
        // Instead, we need `B` and `W`, thus we set edited to false for each node.
        goban.engine.move_tree.traverse((node) => (node.edited = false));

        const moves_gen = goban.engine.move_tree.toSGF();
        expect(rmNewlines(moves_gen)).toBe(rmNewlines(moves));
    },
);

/*
 * check that whatever moves we play, we get them back in sgf
 */
function checkPath(path: string) {
    const goban = new TestGoban({ moves: [] });
    const moves = goban.engine.decodeMoves(path);
    for (let i = 0; i < moves.length; ++i) {
        goban.engine.place(moves[i].x, moves[i].y);
    }
    const sgf = goban.engine.move_tree.toSGF();

    // if we squash everything but the moves, we should get the moves
    expect(sgf.replace(/[[;BW\n]/g, "").replace(/]/g, "")).toBe(path);
}

test("toSGF() simple path", () => {
    const path = "aabbccddee";
    checkPath(path);
});
