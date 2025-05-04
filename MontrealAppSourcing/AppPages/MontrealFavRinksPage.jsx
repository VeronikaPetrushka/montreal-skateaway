import AppLayout from "../AppHelpers/AppLayout"
import MontrealFavRinks from '../AppComponents/MontrealFavRinks';

const MontrealFavRinksPage = () => {
    return (
        <AppLayout appRoute={<MontrealFavRinks />} skateMenu={true} />
    )
};

export default MontrealFavRinksPage;