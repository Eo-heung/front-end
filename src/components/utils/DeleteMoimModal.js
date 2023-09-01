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

const DeleteMoimModal = ({ isOpen, onClose, moimId, moimTitle }) => {
    const navi = useNavigate();

    const handleDeleteMoim = async () => {
        try {
            const response = await axios.delete(`${SPRING_API_URL}/moim/delete-moim/${moimId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("ACCESS_TOKEN")}`
                }
            });

            if (response.data.statusCode === 200) {
                alert(`"${moimTitle}" 모임을 삭제했어요.`);
                onClose(true);
                navi("/moim-controller");
            } else {
                alert("삭제하는데 실패했어요. 다시 시도해보거나 관리자에게 문의해주세요.");
                onClose(false);
            }
        } catch (err) {
            console.error("Error deleting moim", err);
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-delete-title"
            aria-describedby="modal-delete-description"
        >
            <Box sx={style}>
                <Typography id="modal-delete-title" variant="h6" component="h2" style={{ marginBottom: "1rem" }}>
                    정말로 "{moimTitle}" 모임을 삭제하시겠어요?
                </Typography>
                <Typography id="modal-delete-title" variant="h6" component="h2" style={{ marginBottom: "0.2rem" }}>
                    <WarningIcon fontSize="medium" style={{ color: "#FCBE71", marginRight: "1%", paddingTop: "1%" }}></WarningIcon>
                    주의해주세요.
                </Typography>
                <Typography id="modal-delete-description" variant="body1" component="h2" style={{ marginBottom: "1rem" }}>
                    모임을 삭제하면 게시글과 댓글이 모두 삭제되어요.
                </Typography>
                <ButtonZone>
                    <StyledButton
                        type="button"
                        variant="contained"
                        size="large"
                        onClick={handleDeleteMoim}
                        style={{ backgroundColor: "red" }}
                    >삭제</StyledButton>
                    <StyledButton type="button" variant="contained" size="large" onClick={onClose}>취소</StyledButton>
                </ButtonZone>
            </Box>
        </Modal>
    );
};

export default DeleteMoimModal;