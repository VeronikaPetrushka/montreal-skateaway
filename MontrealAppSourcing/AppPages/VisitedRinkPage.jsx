import AppLayout from "../AppHelpers/AppLayout"
import VisitedRink from '../AppComponents/VisitedRink';

const VisitedRinkPage = ({ route }) => {
    const { rink } = route.params;

    return (
        <AppLayout appRoute={<VisitedRink rink={rink} />} skateMenu={false} />
    )
};

export default VisitedRinkPage;