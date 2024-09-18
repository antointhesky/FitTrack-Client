import Modal from "react-modal";
import "./DeleteModal.scss";

Modal.setAppElement("#root");

export default function DeleteModal({ isOpen, closeModal, handleDeleteGoal, goalName }) {
  return (
    <Modal
      className="modal"
      isOpen={isOpen}
      onRequestClose={closeModal}
      overlayClassName="modal__overlay"
      shouldCloseOnOverlayClick={true}
      contentLabel="Delete Goal"
    >
      <div className="modal__container">
        <div className="modal__content">
          <h1 className="modal__heading">{`Delete ${goalName} Goal?`}</h1>
          <p className="modal__body-text">
            {`Please confirm that you'd like to delete the ${goalName} goal. This action cannot be undone.`}
          </p>
        </div>
        <div className="modal__cta-container">
          <button className="modal__cancel-cta" onClick={closeModal}>
            Cancel
          </button>
          <button onClick={handleDeleteGoal} className="modal__delete-cta">
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
