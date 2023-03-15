import Phaser from 'phaser'

export default class PostFXBlur extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {
    constructor(game: Phaser.Game) {
        super({
            game: game,
            renderTarget: true,
            fragShader: [
                "precision mediump float;",

                //"in" attributes from our vertex shader
                "varying vec4 outColor;",
                "varying vec2 outTexCoord;",

                //declare uniforms
                "uniform sampler2D u_texture;",
                "uniform float resolution;",
                "uniform float radius;",
                "uniform vec2 dir;",

                "void main() {",
                //this will be our RGBA sum
                "vec4 sum = vec4(0.0);",

                //our original texcoord for this fragment
                "vec2 tc = outTexCoord;",

                //the amount to blur, i.e. how far off center to sample from 
                //1.0 -> blur by one pixel
                //2.0 -> blur by two pixels, etc.
                "float blur = radius/resolution;",

                //the direction of our blur
                //(1.0, 0.0) -> x-axis blur
                //(0.0, 1.0) -> y-axis blur
                "float hstep = dir.x;",
                "float vstep = dir.y;",

                //apply blurring, using a 9-tap filter with predefined gaussian weights",

                // "sum += texture2D(u_texture, vec2(tc.x - 4.0*blur*hstep, tc.y - 4.0*blur*vstep)) * 0.0162162162;",
                // "sum += texture2D(u_texture, vec2(tc.x - 3.0*blur*hstep, tc.y - 3.0*blur*vstep)) * 0.0540540541;",
                // "sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.1216216216;",
                // "sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.1945945946;",

                // "sum += texture2D(u_texture, vec2(tc.x, tc.y)) * 0.2270270270;",

                // "sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.1945945946;",
                // "sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.1216216216;",
                // "sum += texture2D(u_texture, vec2(tc.x + 3.0*blur*hstep, tc.y + 3.0*blur*vstep)) * 0.0540540541;",
                // "sum += texture2D(u_texture, vec2(tc.x + 4.0*blur*hstep, tc.y + 4.0*blur*vstep)) * 0.0162162162;",

                //5x5
                "sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.003906250;",
                "sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.015625000;",
                "sum += texture2D(u_texture, vec2(tc.x, tc.y - 2.0*blur*vstep)) * 0.023437500;",
                "sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.015625000;",
                "sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y - 2.0*blur*vstep)) * 0.003906250;",

                "sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.015625000;",
                "sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.062500000;",
                "sum += texture2D(u_texture, vec2(tc.x, tc.y - 1.0*blur)) * 0.093750000;",
                "sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.062500000;",
                "sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y - 1.0*blur*vstep)) * 0.015625000;",

                "sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y)) * 0.023437500;",
                "sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y)) * 0.093750000;",
                "sum += texture2D(u_texture, vec2(tc.x, tc.y)) * 0.140625000;",
                "sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y)) * 0.093750000;",
                "sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y)) * 0.023437500;",

                "sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.015625000;",
                "sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.062500000;",
                "sum += texture2D(u_texture, vec2(tc.x, tc.y + 1.0*blur)) * 0.093750000;",
                "sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.062500000;",
                "sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 1.0*blur*vstep)) * 0.015625000;",

                "sum += texture2D(u_texture, vec2(tc.x - 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.003906250;",
                "sum += texture2D(u_texture, vec2(tc.x - 1.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.015625000;",
                "sum += texture2D(u_texture, vec2(tc.x, tc.y + 2.0*blur)) * 0.023437500;",
                "sum += texture2D(u_texture, vec2(tc.x + 1.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.015625000;",
                "sum += texture2D(u_texture, vec2(tc.x + 2.0*blur*hstep, tc.y + 2.0*blur*vstep)) * 0.003906250;",


                //discard alpha for our simple demo,return
                "gl_FragColor =  vec4(sum.rgb, 1.0);",
                "}"

            ].join('\n')
        })

        this.set1f("resolution", this.game.canvas.width);
        this.set1f("radius", 2.0);
        this.set2f("dir", 2.5, 2.5);
    }
}
