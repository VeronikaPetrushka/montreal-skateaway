import AppLayout from "../AppHelpers/AppLayout"
import MontrealRinkDetails from '../AppComponents/MontrealRinkDetails';

const MontrealRinkDetailsPage = ({ route }) => {
    const { rink } = route.params;

    return (
        <AppLayout appRoute={<MontrealRinkDetails rink={rink} />} skateMenu={false} />
    )
};

export default MontrealRinkDetailsPage;