import { SVGProps } from "react";

import { Strings } from "@/constants";

import Svg from "./Svg";

type Props =
    | ({
          src: string;
      } & React.ImgHTMLAttributes<HTMLImageElement>)
    | ({
          src: string;
      } & SVGProps<SVGElement>);

function Icon({ src, ...props }: Props) {
    if (src.endsWith(Strings.svgExtenstion)) {
        return (
            <Svg
                src={src}
                {...(props as SVGProps<SVGElement>)}
            />
        );
    }

    return (
        <img
            src={src}
            {...(props as React.ImgHTMLAttributes<HTMLImageElement>)}
        />
    );
}

export default Icon;
