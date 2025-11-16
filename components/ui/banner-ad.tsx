import {
  BannerAdSize,
  BannerAd as RNBannerAd,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : 'ca-app-pub-9821555230393214/6792852675';

export function BannerAd() {
  return (
    <RNBannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
}
