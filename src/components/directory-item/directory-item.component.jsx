import { useNavigate } from "react-router-dom";
import { BackgroundImage, Body, DirectoryItemContainer } from "./directory-item.styles";

const DirectoryItem = ({category}) => {
   const navigate = useNavigate();
   const { title, imageUrl, route} = category; 
   const onNavigationHandler = () => navigate(route);

   return  (
            <DirectoryItemContainer onClick={onNavigationHandler}>
                <BackgroundImage imageUrl={imageUrl}/>
                <Body>
                    <h2>{title}</h2>
                    <p>Shop Now</p>
                </Body>
              </DirectoryItemContainer>
              );
}

export default DirectoryItem;