export const prefix = "react-meme"

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

export const fontSize = Array.from({ length: 150 }).map((_, i) => i + 1).filter(v => v >= 35)

export const zoom = Array.from({ length: 4 }).map((_, i) => i + 0.1).filter(v => v >= 1.0)

export const defaultFontSize = fontSize[25]

export const defaultFontSizeName = 40

export const defaultFontColor = "#ffffff"

export const defaultFontText = "«Dein Statement»"

export const defaultFontName = "«-Dein Name»"

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

export const headerText = "Grossratswahlen 2020 Kanton Basel-Stadt"

export const logo = 'src/logo/sp_logos.png'

export const aBold = 'src/fonts/AktivGroteskCorp-Bold.ttf'

export const data = 'src/data/data.csv'

