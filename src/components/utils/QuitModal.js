import { Modal, Box, Typography } from "@mui/material";
import { ButtonZone, StyledButton } from "./StyledCreate";
import { SPRING_API_URL } from '../../config';
import WarningIcon from '@mui/icons-material/Warning';
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const QuitModal = ({ isOpen, onClose, moimRegId, moimTitle }) => {
    const navi = useNavigate();

    const handleQuitMoim = async () => {
        try {
            const response = await axios.post(`${SPRING_API_URL}/moimReg/${moimRegId}/applicant-state`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                },
                params: {
                    nowStatus: "QUIT"
                }
            });

            if (response.data.statusCode === 200) {
                alert(`"${moimTitle}" 모임에서 탈퇴했어요.`);
                onClose(true);
                navi("/moim-controller");
            } else {
                alert("탈퇴하는데 실패했어요.");
            }
        } catch (err) {
            console.error("Error quitting moim", err);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-quit-title"
            aria-describedby="modal-quit-description"
        >
            <Box sx={style}>
                <Typography id="modal-quit-title" variant="h6" component="h2" style={{ marginBottom: "1rem" }}>
                    정말로 "{moimTitle}" 모임에서 탈퇴하시겠어요?
                </Typography>
                <Typography id="modal-quit-title" variant="h6" component="h2" style={{ marginBottom: "0.2rem" }}>
                    <WarningIcon fontSize="medium" style={{ color: "#FCBE71", marginRight: "1%", paddingTop: "1%" }}></WarningIcon>
                    주의해주세요.
                </Typography>
                <Typography id="modal-quit-description" variant="body1" component="h2" style={{ marginBottom: "1rem" }}>
                    모임에서 탈퇴해도 작성한 글과 댓글은 사라지지 않아요.
                </Typography>
                <ButtonZone>
                    <StyledButton
                        type="button"
                        variant="contained"
                        size="large"
                        onClick={handleQuitMoim}
                        style={{ backgroundColor: "red" }}
                    >탈퇴</StyledButton>
                    <StyledButton type="button" variant="contained" size="large" onClick={onClose}>취소</StyledButton>
                </ButtonZone>
            </Box>
        </Modal>
    );
};

export default QuitModal;