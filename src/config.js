export const prefix = "react-meme"

export const fontFamily = [
    {
        label: "Helvetica",
        value: "Helvetica"
    }, {
        label: "cursive",
        value: "cursive"
    }, {
        label: "SimSub",
        value: "SimSub"
    }, {
        label: "SimHei",
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


export const imageProcess = [
    {
        label: "default",
        value: "default"
    },
    {
        label: "Reversal",
        value: "reversal"
    },
    {
        label: "Compress",
        value: "compress"
    }
]

export const fontSize = Array.from({ length: 100 }).map((_, i) => i + 1).filter(v => v >= 60)

export const defaultFontSize = fontSize[4]

export const defaultFontColor = "#ffffff"

export const defaultFontText = "Dein Statement"

export const defaultFontName = "Dein Name"

export const img_max_size = 1024

export const range = 0.05

export const textRange = 1

export const whellScaleRange = [0.4, 3.0]

export const textWhellScaleRange = [fontSize[0],fontSize[fontSize.length-1]]

export const defaultScale = 1.0

export const defaultRotate = 0

export const defaultQuality = 0.50

export const previewContentStyle = {
    width: 1080,
    height: 1080
}
