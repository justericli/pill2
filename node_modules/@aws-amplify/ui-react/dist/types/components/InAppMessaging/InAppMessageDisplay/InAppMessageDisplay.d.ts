/// <reference types="react" />
import { InAppMessageDisplayProps } from './types';
declare function InAppMessageDisplay({ components: overrideComponents, }: InAppMessageDisplayProps): JSX.Element;
declare namespace InAppMessageDisplay {
    var BannerMessage: typeof import("../BannerMessage").BannerMessage;
    var CarouselMessage: <P>(_: P) => null;
    var FullScreenMessage: typeof import("../FullScreenMessage").FullScreenMessage;
    var ModalMessage: typeof import("../ModalMessage").ModalMessage;
}
export default InAppMessageDisplay;
