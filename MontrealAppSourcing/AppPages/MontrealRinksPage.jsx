import AppLayout from "../AppHelpers/AppLayout"
import MontrealRinks from '../AppComponents/MontrealRinks';

const MontrealRinksPage = () => {
    return (
        <AppLayout appRoute={<MontrealRinks />} skateMenu={true} />
    )
};

export default MontrealRinksPage;