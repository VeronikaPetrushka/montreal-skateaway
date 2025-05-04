import AppLayout from "../AppHelpers/AppLayout"
import CrowdLevel from '../AppComponents/CrowdLevel';

const CrowdLevelPage = ({ route }) => {
    const { rink } = route.params;

    return (
        <AppLayout appRoute={<CrowdLevel rink={rink} />} skateMenu={false} />
    )
};

export default CrowdLevelPage;