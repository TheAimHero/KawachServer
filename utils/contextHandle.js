export default function contextHandle(req, res) {
  const { link } = req.body;;
  res.status(200).json({ status: 'success' });
}
