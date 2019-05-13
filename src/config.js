export const prefix = "react-meme"

export const fontFamily = [
    {
        label: "Microsoft YaHei",
        value: "Microsoft YaHei"
    },
    {
        label: "Helvetica",
        value: "Helvetica"
    }, {
        label: "Cursive",
        value: "cursive"
    }, {
        label: "SimSub",
        value: "SimSub"
    }, {
        label: "SimHe",
        value: "SimHei"
    }, {
        label: "KaiTi",
        value: "KaiTi"
    }, {
        label: "STKaiti",
        value: "STKaiti"
    }, {
        label: "LiSu",
        value: "LiSu"
    }, {
        label: "YouYuan",
        value: "YouYuan"
    }
]

// TODO
export const imageProcess = [
    {
        label: "default",
        value: "default"
    },
    {
        label: "reversal",
        value: "reversal"
    },
    {
        label: "compress",
        value: "compress"
    }
]

export const fontSize = Array.from({ length: 100 }).map((_, i) => i + 1).filter(v => v >= 12)

// 20 px
export const defaultFontSize = fontSize[4]

export const defaultFontColor = "#444"

export const defaultFontText = "Microsoft YaHei"


export const img_max_size = 1024


export const range = 0.05    


export const textRange = 1        

export const whellScaleRange = [0.4, 3.0]


export const textWhellScaleRange = [fontSize[0],fontSize[fontSize.length-1]]


export const defaultScale = 1.0
export const defaultRotate = 0

export const defaultQuality = 0.50


export const previewContentStyle = {
    width: 300,
    height: 300
}