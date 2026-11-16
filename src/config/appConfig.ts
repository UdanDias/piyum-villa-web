const mode = process.env.REACT_APP_DATA_MODE ?? 'mock';
if (!['mock', 'api'].includes(mode)) throw new Error('REACT_APP_DATA_MODE must be mock or api');
export const appConfig = {
  mock: mode === 'mock',
  apiUrl: (process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8081/piyumvilla/api/v1').replace(/\/+$/, ''),
  hotelName: 'Piyum Villa', phone: '+94 71 171 7077', phoneHref: 'tel:+94711717077',
  address: 'Pelena-Polwatta-Denipitiya Rd, Weligama, Southern Province',
  timezone: 'Asia/Colombo', currency: 'LKR',
};
export const asset = (name: string) => `${process.env.PUBLIC_URL ?? ''}/assets/images/${name}.jpg`;
export const fallbackImage = `${process.env.PUBLIC_URL ?? ''}/assets/placeholders/coast.svg`;
