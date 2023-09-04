import { Modal, Box, Typography } from "@mui/material";
import { ButtonZone, StyledButton } from "./StyledCreate";
import { styled } from '@mui/system';

const MyPicContainer = styled('div')`
    padding-top: 10px;
    padding-bottom: 20px;
    position: relative;
    width: 260px;
`;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
};

const ProfileModal = ({ isOpen, onClose, onConfirm, profileImage, moimTitle }) => {
    console.log("profileImage", profileImage);
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-comment-title"
            aria-describedby="modal-comment-description"
        >
            <Box sx={style}>
                <MyPicContainer>
                    {profileImage &&
                        <div className="sb-sidenav-profile">
                            <img
                                alt="모임 프로필 이미지"
                                className="sidenav-profile-img"
                                src={profileImage}
                                style={{ marginTop: "0.6rem" }}
                            ></img>
                            <div className="sidenav-profile-appoint" style={{ marginTop: "1rem" }}>
                                <span style={{ fontSize: "1.2rem" }}>"{moimTitle}"</span>
                                <br />
                                <div
                                    style={{
                                        fontSize: "1.1rem",
                                        marginTop: "6px",
                                        paddingLeft: "3px",
                                        color: "gray",
                                    }}
                                >
                                    모임에 어서오세요!
                                </div>
                            </div>
                        </div>
                    }
                </MyPicContainer>
                <Typography id="modal-comment-title" variant="h6" component="h2" style={{ marginBottom: "1rem" }}>
                    프로필 사진을 이렇게 바꾸시겠어요?
                </Typography>
                <ButtonZone>
                    <StyledButton type="button" variant="contained" size="large" onClick={onConfirm}>저장</StyledButton>
                    <StyledButton type="button" variant="contained" size="large" onClick={onClose}>취소</StyledButton>
                </ButtonZone>
            </Box>
        </Modal>
    );
};

export default ProfileModal;