import MenChappal from '../../../assets/CardLogos/MenChappal.webp';
import MensSandal from '../../../assets/CardLogos/MenSandal.webp';
import MenShoes from '../../../assets/CardLogos/MenShoes.webp';
import LadiesShoes from '../../../assets/CardLogos/LadiesShoes.webp';
import LadiesSandal from '../../../assets/CardLogos/LadiesSandal.webp';
import LadiesChappal from '../../../assets/CardLogos/LadiesChappal.webp';
import kidsShoes from '../../../assets/CardLogos/kidsShoes.webp';


export const NavigationLinksCards1 = [
    {
    name: 'Men Shoes',
    nameHindi: 'मेन शूज़',
    image:MenShoes,
    navigateParams: `/CategoryPages?type=Men,shoes&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}&&strict=true`
  },
  {
    name: 'Men Chappal',
    nameHindi: 'मेन चप्पल',
    image:MenChappal,
    navigateParams: `/CategoryPages?type=Men,chappal&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}&&strict=true`
  },
  {
    name: 'Men Sandal',
    nameHindi: 'मेन सैंडल',
    image:MensSandal,

    navigateParams: `/CategoryPages?type=Men,sandal&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}&&strict=true`
  },
  
    {
    name: 'Ladies Sandal',
    nameHindi: 'लेडीज़ सैंडल',
    image:LadiesSandal,

    navigateParams: `/CategoryPages?type=ladies,sandal&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}&&strict=true`
  },
  {
    name: 'Ladies Chappal',
    nameHindi: 'लेडीज़ चप्पल',
    image:LadiesChappal,

    navigateParams: `/CategoryPages?type=ladies,chappal&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}&&strict=true`
  },
  {
    name: 'Ladies Shoes',
    nameHindi: 'लेडीज़ शूज़',
    image:LadiesShoes,

    navigateParams: `/CategoryPages?type=ladies,shoes&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}&&strict=true`
  },
  
  {
    name: 'Kids Chappal',
    image:kidsShoes,

    nameHindi: 'किड्स चप्पल',

    
    navigateParams: `/CategoryPages?type=kids,chappal&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}&&strict=true`
  },
  {
    name: 'Kids Shoes',
    image:kidsShoes,

    nameHindi: 'किड्स शूज़',
    image:MenChappal,

    navigateParams: `/CategoryPages?type=kids,shoes&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}&&strict=true`
  },
  {
    name: 'Kids Sandal',
    image:kidsShoes,
    nameHindi: 'किड्स सैंडल',
    image:MenChappal,

    navigateParams: `/CategoryPages?type=kids,sandal&&id=${import.meta.env.VITE_APP_JIO_CATEGORY_ID}&&strict=true`
  }
];