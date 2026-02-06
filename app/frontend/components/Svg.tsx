import { SVGProps, useEffect, useState } from "react";
import { createElement } from "react";

import { Strings } from "@/constants";

const innerFunction = (
    element: Element,
    props?: Record<string, any>,
): React.ReactNode => {
    const tagName = element.tagName;
    let _props = props || {};

    for (let i = 0; i < element.attributes.length; i++) {
        _props[element.attributes[i].nodeName] = element.attributes[i].nodeValue;
    }

    const children: React.ReactNode[] = Array.from(element.children).map((item, index) =>
        innerFunction(item, { key: index }),
    );

    return createElement(tagName, _props, children);
};

const convertDocEleToReact = (element: HTMLElement, props: SVGProps<SVGElement>) => {
    try {
        return innerFunction(element, props);
    } catch (ex) {
        return createElement(Strings.span, {}, Strings.svgError);
    }
};

type Props = {
    src: string;
} & SVGProps<SVGElement>;

export const Svg = ({ src, ...props }: Props) => {
    const [Comp, setComp] = useState<React.ReactNode>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetch(src)
            .then((res) => res.text())
            .then((res) => {
                const domParser = new DOMParser();
                const ele = domParser.parseFromString(res, Strings.svgType);
                setComp(convertDocEleToReact(ele.documentElement, props));
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return loading ? null : Comp;
};

export default Svg;
