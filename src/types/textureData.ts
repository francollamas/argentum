import {SpritesheetData} from "pixi.js";

export type TextureData = {
    [key: string]: { json: SpritesheetData, png: string }
}

export type SpritesheetList = {
    [key: string]: string
}