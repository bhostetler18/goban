/*
 * Copyright 2022 Benjamin P. Jones
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This is a minimal implementation of GobanCore.  Currently it is just enough
// to build (in other words, silence the abstract method errors).  In the future
// I was thinking we'd add:
//    - [ARRANGE] easy to read board state input.  For instance, maybe it can be
//      initialized with a GnuGo-style ASCII string instead of an Array of 1s 2s
//      and 0s.
//    - [ASSERT] public state tracking: `is_pen_enabled`, `current_message`,
//      `current_title` etc. A way for testers to peer into the internals

import { GobanConfig, GobanCore, GobanSelectedThemes } from "./GobanCore";
import { GoEngine } from "./GoEngine";
import { MessageID } from "./messages";
import { MoveTreePenMarks } from "./MoveTree";

export class TestGoban extends GobanCore {
    public engine: GoEngine;

    constructor(config: GobanConfig) {
        super(config);

        this.engine = new GoEngine(config);
    }

    public enablePen(): void {}
    public disablePen(): void {}
    public clearAnalysisDrawing(): void {}
    public drawPenMarks(penmarks: MoveTreePenMarks): void {}
    public showMessage(
        msg_id: MessageID,
        parameters?: { [key: string]: any } | undefined,
        timeout?: number | undefined,
    ): void {}
    public clearMessage(): void {}
    protected setThemes(themes: GobanSelectedThemes, dont_redraw: boolean): void {}
    public drawSquare(i: number, j: number): void {}
    public redraw(force_clear?: boolean | undefined): void {}
    public move_tree_redraw(no_warp?: boolean | undefined): void {}
    public setMoveTreeContainer(container: HTMLElement): void {}
    protected setTitle(title: string): void {}
    protected enableDrawing(): void {}
    protected disableDrawing(): void {}
}
