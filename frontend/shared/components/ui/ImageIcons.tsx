import Image from "next/image";
import React from "react";

type ImgIconProps = {
  alt?: string;
  size?: number; // width and height in px
  className?: string;
};

/**
 * Generic image icon component using `next/image` and public `image/` assets.
 * Place your icon files in `public/image/` with the filenames listed below.
 */


export const ImgIcon: React.FC<ImgIconProps & { src: string }> = ({
  src,
  alt = "icon",
  size = 30,
  className = "",
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
      priority={false}
      style={{ width: "auto", height: "auto" }}
    />
  );
};

// Specific reusable icons (these expect files to exist in `public/image/`)
export const IconBusinessImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/business.png" alt={props.alt ?? "Business"} size={props.size} className={props.className} />
);

export const IconCareersImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/careers.png" alt={props.alt ?? "Careers"} size={props.size} className={props.className} />
);

export const IconConstructionImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/construction.png" alt={props.alt ?? "Construction"} size={props.size} className={props.className} />
);

export const IconCommercialIndustrialImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/commercial-industrial.png" alt={props.alt ?? "Commercial & Industrial"} size={props.size} className={props.className} />
);

export const IconDonationsImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/donations.png" alt={props.alt ?? "Donations"} size={props.size} className={props.className} />
);

export const IconHealthcareImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/healthcare.png" alt={props.alt ?? "Healthcare"} size={props.size} className={props.className} />
);
export const IconInvestmentImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/investment.png" alt={props.alt ?? "Investment"} size={props.size} className={props.className} />
);
export const IconMarketPlaceImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/market-place.png" alt={props.alt ?? "Market Place"} size={props.size} className={props.className} />
);
export const IconRealEstateImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/real-estate.png" alt={props.alt ?? "Real Estate"} size={props.size} className={props.className} />
);
export const IconTechnicalImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/technical.png" alt={props.alt ?? "Technical"} size={props.size} className={props.className} />
);
export const IconVisaTravelImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/visa-travel.png" alt={props.alt ?? "Visa & Travel"} size={props.size} className={props.className} />
);
export const IconEducationImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/icons/education.png" alt={props.alt ?? "Education"} size={props.size} className={props.className} />
);
///
export const IconBankImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/footer/bank.png" alt={props.alt ?? "Bank"} size={props.size} className={props.className} />
);
export const IconBitcoinImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/footer/bitcoin.png" alt={props.alt ?? "Bitcoin"} size={props.size} className={props.className} />
);
export const IconPayoneerImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/footer/payoneer.png" alt={props.alt ?? "Payoneer"} size={props.size} className={props.className} />
);
export const IconPaypalImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/footer/paypal.png" alt={props.alt ?? "Paypal"} size={props.size} className={props.className} />
);
export const IconSbiImg: React.FC<ImgIconProps> = (props) => (
  <ImgIcon src="/image/footer/sbi.png" alt={props.alt ?? "SBI"} size={props.size} className={props.className} />
);

const ImageIcons = {
    IconBusinessImg,
    IconCareersImg,
    IconConstructionImg,
    IconCommercialIndustrialImg,
    IconDonationsImg,
    IconHealthcareImg,
    IconInvestmentImg,
    IconMarketPlaceImg,
    IconRealEstateImg,
    IconTechnicalImg,
    IconEducationImg,
    IconVisaTravelImg,
    IconBankImg,
    IconBitcoinImg,
    IconPayoneerImg,
    IconPaypalImg,
    IconSbiImg,
};

export default ImageIcons;
