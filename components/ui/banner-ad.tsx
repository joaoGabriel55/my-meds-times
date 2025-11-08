import {
  BannerAdSize,
  BannerAd as RNBannerAd,
  TestIds,
} from "react-native-google-mobile-ads";

const adUnitId = __DEV__
  ? TestIds.ADAPTIVE_BANNER
  : process.env.BANNER_UNIT_ID!;

export function BannerAd() {
  return (
    <RNBannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
    />
  );
}
