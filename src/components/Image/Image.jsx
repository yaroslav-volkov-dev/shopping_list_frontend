import { BASE_URL } from '../../api/axiosConfig.js';

export const Image = (props) => {
  const { img: { alt, title, url } } = props;

  return <img {...props} src={`${BASE_URL}${url}`} alt={alt} title={title} />;
};