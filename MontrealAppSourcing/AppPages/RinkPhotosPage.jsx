import AppLayout from "../AppHelpers/AppLayout"
import RinkPhotos from '../AppComponents/RinkPhotos';

const RinkPhotosPage = ({ route }) => {
    const { rink } = route.params;

    return (
        <AppLayout appRoute={<RinkPhotos rink={rink} />} skateMenu={false} />
    )
};

export default RinkPhotosPage;